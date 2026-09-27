package com.acme.modernized.service;

import com.acme.modernized.model.Order;
import com.acme.modernized.repository.CustomerOrderRepository;
import com.acme.modernized.notification.OrderNotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * CustomerOrderService — single-responsibility service for order processing.
 * Dependencies injected; no SQL, no email logic, no hardcoded config.
 */
@Service
public class CustomerOrderService {

    private final CustomerOrderRepository repository;
    private final OrderNotificationService notificationService;

    public CustomerOrderService(
            CustomerOrderRepository repository,
            OrderNotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Order placeOrder(long customerId, long productId, int quantity) {
        var customer = repository.findCustomerById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + customerId));

        var product = repository.findProductById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        if (product.getStockQty() < quantity) {
            throw new IllegalStateException("Insufficient stock for product: " + productId);
        }

        double total = product.getPrice() * quantity;
        Order order = repository.createOrder(customerId, productId, quantity, total);
        repository.decrementStock(productId, quantity);

        notificationService.sendOrderConfirmation(customer, order);
        return order;
    }

    public List<Order> getPendingOrders() {
        return repository.findByStatus("PENDING");
    }
}
