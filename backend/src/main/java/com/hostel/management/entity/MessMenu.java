package com.hostel.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "mess_menu")
public class MessMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dayName;
    private String breakfast;
    private String lunch;
    private String snacks;
    private String dinner;
    private Integer calories;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDayName() { return dayName; }
    public void setDayName(String dayName) { this.dayName = dayName; }
    public String getBreakfast() { return breakfast; }
    public void setBreakfast(String breakfast) { this.breakfast = breakfast; }
    public String getLunch() { return lunch; }
    public void setLunch(String lunch) { this.lunch = lunch; }
    public String getSnacks() { return snacks; }
    public void setSnacks(String snacks) { this.snacks = snacks; }
    public String getDinner() { return dinner; }
    public void setDinner(String dinner) { this.dinner = dinner; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
}
