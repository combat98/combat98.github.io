# Kotlin Android 开发

## 简介

Kotlin 是 Android 开发的首选语言，提供了简洁、安全的语法。

## 环境配置

### 安装 Android Studio

下载并安装 [Android Studio](https://developer.android.com/studio)

### 创建项目

1. 打开 Android Studio
2. 选择 "New Project"
3. 选择 "Empty Activity"
4. 选择 Kotlin 作为语言

## Activity 示例

```kotlin
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        val textView = findViewById<TextView>(R.id.textView)
        val button = findViewById<Button>(R.id.button)
        
        button.setOnClickListener {
            textView.text = "Hello, Kotlin!"
        }
    }
}
```

## Jetpack Compose

```kotlin
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*

@Composable
fun Greeting(name: String) {
    var count by remember { mutableStateOf(0) }
    
    Column {
        Text(text = "Hello, $name!")
        Button(onClick = { count++ }) {
            Text("点击次数: $count")
        }
    }
}
```

## 参考资源

- [Android 开发文档](https://developer.android.com/kotlin)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
