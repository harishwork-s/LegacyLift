package com.acme.legacy;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Date;
import javax.mail.*;
import javax.mail.internet.*;

/**
 * CustomerOrderProcessor - handles all order processing for ACME Corp.
 * Written 2009. DO NOT TOUCH - "it works don't fix it"
 */
public class CustomerOrderProcessor {

    // Hardcoded DB credentials - TODO: move to config someday
    private static final String DB_URL = "jdbc:oracle:thin:@192.168.1.5:1521:ACMEDB";
    private static final String DB_USER = "app_user";
    private static final String DB_PASS = "Passw0rd123!";
    private static final String SMTP_HOST = "mail.acme.internal";

    public void processOrder(int customerId, int productId, int quantity) {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // Open new connection every call (no pooling)
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            stmt = conn.createStatement();

            // Check customer exists
            rs = stmt.executeQuery("SELECT * FROM customers WHERE id = " + customerId);
            if (!rs.next()) {
                System.out.println("Customer not found: " + customerId);
                return;
            }
            String customerEmail = rs.getString("email");
            String customerName  = rs.getString("name");

            // Check stock - raw string concat (SQL injection risk)
            rs = stmt.executeQuery(
                "SELECT stock_qty, price FROM products WHERE id = " + productId);
            if (!rs.next()) {
                System.out.println("Product not found: " + productId);
                return;
            }
            int stockQty = rs.getInt("stock_qty");
            double price = rs.getDouble("price");

            if (stockQty < quantity) {
                System.out.println("Insufficient stock for product: " + productId);
                return;
            }

            // Calculate total - no tax logic, no discount, no rounding
            double total = price * quantity;

            // Insert order - another raw concat
            stmt.executeUpdate(
                "INSERT INTO orders (customer_id, product_id, quantity, total, order_date) " +
                "VALUES (" + customerId + ", " + productId + ", " + quantity +
                ", " + total + ", SYSDATE)");

            // Update stock inline
            stmt.executeUpdate(
                "UPDATE products SET stock_qty = stock_qty - " + quantity +
                " WHERE id = " + productId);

            // Audit log written to DB with no transaction
            stmt.executeUpdate(
                "INSERT INTO audit_log (event, ts) VALUES ('ORDER_PLACED', SYSDATE)");

            System.out.println("Order placed. Total: $" + total);

            // Send confirmation email - blocking, no retry
            sendEmail(customerEmail, customerName, productId, quantity, total);

        } catch (Exception e) {
            // Swallow all exceptions
            e.printStackTrace();
        } finally {
            try { if (rs   != null) rs.close();   } catch (Exception ignored) {}
            try { if (stmt != null) stmt.close(); } catch (Exception ignored) {}
            try { if (conn != null) conn.close(); } catch (Exception ignored) {}
        }
    }

    public List<int[]> getPendingOrders() {
        List<int[]> orders = new ArrayList<>();
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, customer_id FROM orders WHERE status='PENDING'");
            while (rs.next()) {
                orders.add(new int[]{rs.getInt("id"), rs.getInt("customer_id")});
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return orders;
    }

    // Email send logic buried inside processor class
    private void sendEmail(String to, String name, int productId, int qty, double total) {
        Properties props = new Properties();
        props.put("mail.smtp.host", SMTP_HOST);
        Session session = Session.getDefaultInstance(props, null);
        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress("noreply@acme.com"));
            msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            msg.setSubject("Order Confirmation");
            msg.setText("Dear " + name + ",\n\nYour order for product #" + productId +
                " (qty: " + qty + ") has been placed.\nTotal: $" + total +
                "\n\nACME Corp");
            Transport.send(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
