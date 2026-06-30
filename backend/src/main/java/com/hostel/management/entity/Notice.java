package com.hostel.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notices")
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1200)
    private String body;
    private String audience = "ALL";
    private String priority = "NORMAL";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
