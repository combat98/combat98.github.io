---
layout: page
---

<style>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: var(--vp-c-text-1);
}

.error-message {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.error-quote {
  font-style: italic;
  color: var(--vp-c-text-3);
  margin: 1rem 0 2rem;
  font-size: 0.95rem;
}

.home-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.error-animation {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
}
</style>

<div class="error-page">
  <div class="error-animation">
    <h1 class="error-code">404</h1>
  </div>
  
  <h2 class="error-title">PAGE NOT FOUND</h2>
  
  <p class="error-message">
    抱歉，您访问的页面不存在或已被移除。
  </p>
  
  <p class="error-quote">
    "But if you don't change your direction, and if you keep looking, you may end up where you are heading."
  </p>
  
  <a href="/" class="home-button">
    🏠 Take me home
  </a>
</div>
