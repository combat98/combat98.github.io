# Spring Security

## 简介

Spring Security 是一个功能强大且高度可定制的身份验证和访问控制框架，是保护基于 Spring 的应用程序的事实标准。

### 核心功能

- **身份认证（Authentication）** - 验证用户身份
- **授权（Authorization）** - 控制用户访问权限
- **防护常见攻击** - CSRF、会话固定、点击劫持等
- **与Spring生态集成** - 无缝集成Spring Boot、Spring MVC等

## 快速开始

### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 基本配置

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .logout(logout -> logout
                .permitAll()
            );
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## 核心概念

### 1. 认证（Authentication）

认证是验证用户身份的过程。

#### 认证流程

1. 用户提交用户名和密码
2. 系统验证凭证是否正确
3. 获取用户的上下文信息（角色、权限等）
4. 建立安全上下文（Security Context）

#### 自定义用户认证

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));
        
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .authorities(user.getRoles())
            .build();
    }
}
```

### 2. 授权（Authorization）

授权是控制用户访问资源权限的过程。

#### 方法级别授权

```java
@Service
public class UserService {
    
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
        // 只有ADMIN角色可以执行
    }
    
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public void updateUser(User user) {
        // 需要USER_WRITE权限
    }
    
    @PreAuthorize("#username == authentication.principal.username")
    public User getUser(String username) {
        // 只能查询自己的信息
    }
}
```

#### URL级别授权

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
        .requestMatchers("/public/**").permitAll()
        .anyRequest().authenticated()
    );
    return http.build();
}
```

### 3. 密码加密

Spring Security 提供多种密码加密方式。

```java
@Configuration
public class PasswordConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt加密（推荐）
        return new BCryptPasswordEncoder();
    }
}
```

使用示例：

```java
@Service
public class UserService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public void registerUser(String username, String rawPassword) {
        String encodedPassword = passwordEncoder.encode(rawPassword);
        // 保存加密后的密码
    }
    
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
```

## 高级特性

### 1. JWT认证

基于Token的无状态认证。

#### JWT工具类

```java
@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
    }
    
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

#### JWT过滤器

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        String token = getJwtFromRequest(request);
        
        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

### 2. OAuth2 集成

支持第三方登录（如GitHub、Google等）。

```java
@Configuration
public class OAuth2Config {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .defaultSuccessUrl("/home")
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService())
                )
            );
        return http.build();
    }
    
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService() {
        return new CustomOAuth2UserService();
    }
}
```

### 3. 记住我功能

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .rememberMe(remember -> remember
            .key("uniqueAndSecret")
            .tokenValiditySeconds(86400) // 24小时
            .userDetailsService(userDetailsService)
        );
    return http.build();
}
```

### 4. CSRF防护

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        );
    return http.build();
}
```

对于REST API，通常禁用CSRF：

```java
http.csrf(csrf -> csrf.disable());
```

## 常见场景

### 1. 获取当前登录用户

```java
@RestController
public class UserController {
    
    @GetMapping("/current-user")
    public String getCurrentUser() {
        Authentication authentication = 
            SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
    
    // 或使用注解
    @GetMapping("/profile")
    public User getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.findByUsername(userDetails.getUsername());
    }
}
```

### 2. 动态权限控制

```java
@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {
    
    @Override
    public boolean hasPermission(Authentication authentication, 
                                 Object targetDomainObject, 
                                 Object permission) {
        if (authentication == null || targetDomainObject == null) {
            return false;
        }
        
        // 自定义权限判断逻辑
        return checkPermission(authentication, targetDomainObject, permission);
    }
    
    @Override
    public boolean hasPermission(Authentication authentication, 
                                 Serializable targetId, 
                                 String targetType, 
                                 Object permission) {
        return false;
    }
    
    private boolean checkPermission(Authentication authentication, 
                                   Object targetDomainObject, 
                                   Object permission) {
        // 实现具体的权限检查逻辑
        return true;
    }
}
```

使用：

```java
@PreAuthorize("hasPermission(#article, 'WRITE')")
public void updateArticle(Article article) {
    // 检查用户是否有修改该文章的权限
}
```

### 3. 多种认证方式

```java
@Configuration
public class MultiAuthConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            )
            .formLogin(Customizer.withDefaults())  // 表单登录
            .httpBasic(Customizer.withDefaults())  // HTTP Basic认证
            .oauth2Login(Customizer.withDefaults()); // OAuth2登录
        
        return http.build();
    }
}
```

## 最佳实践

### 1. 密码策略

```java
@Bean
public PasswordEncoder passwordEncoder() {
    // 使用BCrypt，强度为10-12
    return new BCryptPasswordEncoder(11);
}
```

### 2. 会话管理

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            .maximumSessions(1) // 同一用户最多1个会话
            .maxSessionsPreventsLogin(true) // 阻止新登录
        );
    return http.build();
}
```

### 3. 安全响应头

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .headers(headers -> headers
            .contentSecurityPolicy(csp -> 
                csp.policyDirectives("default-src 'self'"))
            .frameOptions(frame -> frame.deny())
            .xssProtection(xss -> xss.block(true))
        );
    return http.build();
}
```

### 4. 异常处理

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .exceptionHandling(exception -> exception
            .authenticationEntryPoint(
                (request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("未授权访问");
                })
            .accessDeniedHandler(
                (request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("权限不足");
                })
        );
    return http.build();
}
```

## 常见问题

### 1. 跨域问题

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 2. 静态资源放行

```java
@Bean
public WebSecurityCustomizer webSecurityCustomizer() {
    return (web) -> web.ignoring()
        .requestMatchers("/css/**", "/js/**", "/images/**");
}
```

### 3. 测试环境配置

```java
@Profile("test")
@Configuration
public class TestSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
```

## 总结

Spring Security 是一个功能强大的安全框架，主要特点：

- ✅ 全面的认证和授权支持
- ✅ 防护常见Web安全漏洞
- ✅ 灵活的配置方式
- ✅ 与Spring生态无缝集成
- ✅ 支持多种认证方式（表单、JWT、OAuth2等）

掌握 Spring Security 对于开发安全的企业级应用至关重要。

## 参考资源

- [Spring Security 官方文档](https://spring.io/projects/spring-security)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Security GitHub](https://github.com/spring-projects/spring-security)
