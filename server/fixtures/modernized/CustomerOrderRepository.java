package com.acme.modernized.repository;

import com.acme.modernized.model.Customer;
import com.acme.modernized.model.Order;
import com.acme.modernized.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * CustomerOrderRepository — data-access only, parameterized queries throughout.
 */
@Repository
public class CustomerOrderRepository {

    private final JdbcTemplate jdbc;

    public CustomerOrderRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Optional<Customer> findCustomerById(long id) {
        return jdbc.query(
                "SELECT id, name, email FROM customers WHERE id = ?",
                (rs, row) -> new Customer(rs.getLong("id"), rs.getString("name"), rs.getString("email")),
                id
        ).stream().findFirst();
    }

    public Optional<Product> findProductById(long id) {
        return jdbc.query(
                "SELECT id, stock_qty, price FROM products WHERE id = ?",
                (rs, row) -> new Product(rs.getLong("id"), rs.getInt("stock_qty"), rs.getDouble("price")),
                id
        ).stream().findFirst();
    }

    public Order createOrder(long customerId, long productId, int quantity, double total) {
        jdbc.update(
                "INSERT INTO orders (customer_id, product_id, quantity, total, order_date, status) VALUES (?,?,?,?,NOW(),'PENDING')",
                customerId, productId, quantity, total
        );
        long id = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
        return new Order(id, customerId, productId, quantity, total, "PENDING");
    }

    public void decrementStock(long productId, int quantity) {
        jdbc.update("UPDATE products SET stock_qty = stock_qty - ? WHERE id = ?", quantity, productId);
    }

    public List<Order> findByStatus(String status) {
        return jdbc.query(
                "SELECT id, customer_id, product_id, quantity, total, status FROM orders WHERE status = ?",
                (rs, row) -> new Order(rs.getLong("id"), rs.getLong("customer_id"), rs.getLong("product_id"),
                        rs.getInt("quantity"), rs.getDouble("total"), rs.getString("status")),
                status
        );
    }
}
