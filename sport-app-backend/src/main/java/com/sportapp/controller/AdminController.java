package com.sportapp.controller;

import com.sportapp.dto.UpdateRoleRequest;
import com.sportapp.dto.UserDTO;
import com.sportapp.mapper.UserMapper;
import com.sportapp.model.User;
import com.sportapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final UserMapper userMapper;

    public AdminController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        User updatedUser = userService.updateRole(id, request.getRole());
        return ResponseEntity.ok(userMapper.toDTO(updatedUser));
    }
}
