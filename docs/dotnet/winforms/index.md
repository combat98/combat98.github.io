# WinForms

## 概述

Windows Forms（WinForms）是微软推出的传统桌面应用程序开发框架，简单易用，适合快速开发桌面应用。

### 核心特性

- 拖拽式设计器
- 丰富的控件库
- 事件驱动编程
- 简单易学
- 成熟稳定

### WinForms vs WPF

| 特性 | WinForms | WPF |
|------|----------|-----|
| 学习曲线 | 平缓 | 陡峭 |
| 设计方式 | 拖拽 | XAML |
| 性能 | 较好 | 更好 |
| UI 灵活性 | 一般 | 强大 |
| 适用场景 | 简单应用 | 复杂应用 |

## 快速开始

### 创建项目

```bash
dotnet new winforms -n MyWinFormsApp
cd MyWinFormsApp
dotnet run
```

### 项目结构

```
MyWinFormsApp/
├── Form1.cs              # 窗体代码
├── Form1.Designer.cs     # 设计器生成代码
├── Form1.resx            # 资源文件
├── Program.cs            # 程序入口
└── MyWinFormsApp.csproj  # 项目文件
```

### Program.cs

```csharp
namespace MyWinFormsApp
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }
    }
}
```

### Form1.cs

```csharp
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }
    
    private void button1_Click(object sender, EventArgs e)
    {
        MessageBox.Show("Hello WinForms!");
    }
}
```

## 常用控件

### 文本控件

```csharp
// Label 标签
Label label = new Label
{
    Text = "姓名:",
    Location = new Point(10, 10),
    AutoSize = true
};

// TextBox 文本框
TextBox textBox = new TextBox
{
    Location = new Point(60, 10),
    Width = 200
};

// RichTextBox 富文本框
RichTextBox richTextBox = new RichTextBox
{
    Location = new Point(10, 50),
    Size = new Size(300, 200)
};

// MaskedTextBox 格式化文本框
MaskedTextBox maskedTextBox = new MaskedTextBox
{
    Mask = "000-0000-0000",  // 电话号码格式
    Location = new Point(10, 10)
};
```

### 按钮控件

```csharp
// Button 普通按钮
Button button = new Button
{
    Text = "点击我",
    Location = new Point(10, 10),
    Size = new Size(100, 30)
};
button.Click += Button_Click;

// CheckBox 复选框
CheckBox checkBox = new CheckBox
{
    Text = "同意条款",
    Location = new Point(10, 50),
    Checked = true
};

// RadioButton 单选按钮
RadioButton radioButton1 = new RadioButton
{
    Text = "男",
    Location = new Point(10, 80),
    Checked = true
};
RadioButton radioButton2 = new RadioButton
{
    Text = "女",
    Location = new Point(80, 80)
};
```

### 列表控件

```csharp
// ListBox 列表框
ListBox listBox = new ListBox
{
    Location = new Point(10, 10),
    Size = new Size(200, 150)
};
listBox.Items.Add("项目1");
listBox.Items.Add("项目2");
listBox.Items.Add("项目3");

// ComboBox 下拉框
ComboBox comboBox = new ComboBox
{
    Location = new Point(10, 10),
    Width = 200
};
comboBox.Items.AddRange(new object[] { "选项1", "选项2", "选项3" });
comboBox.SelectedIndex = 0;

// CheckedListBox 复选列表框
CheckedListBox checkedListBox = new CheckedListBox
{
    Location = new Point(10, 10),
    Size = new Size(200, 150)
};
checkedListBox.Items.Add("项目1", true);
checkedListBox.Items.Add("项目2", false);

// ListView 列表视图
ListView listView = new ListView
{
    Location = new Point(10, 10),
    Size = new Size(400, 200),
    View = View.Details
};
listView.Columns.Add("姓名", 100);
listView.Columns.Add("年龄", 50);
listView.Columns.Add("邮箱", 150);

ListViewItem item = new ListViewItem("张三");
item.SubItems.Add("25");
item.SubItems.Add("zhangsan@example.com");
listView.Items.Add(item);
```

### DataGridView 数据表格

```csharp
DataGridView dataGridView = new DataGridView
{
    Location = new Point(10, 10),
    Size = new Size(600, 300),
    AutoGenerateColumns = false
};

// 添加列
dataGridView.Columns.Add(new DataGridViewTextBoxColumn
{
    Name = "Name",
    HeaderText = "姓名",
    DataPropertyName = "Name",
    Width = 100
});
dataGridView.Columns.Add(new DataGridViewTextBoxColumn
{
    Name = "Age",
    HeaderText = "年龄",
    DataPropertyName = "Age",
    Width = 50
});
dataGridView.Columns.Add(new DataGridViewTextBoxColumn
{
    Name = "Email",
    HeaderText = "邮箱",
    DataPropertyName = "Email",
    Width = 200
});

// 绑定数据
var users = new List<User>
{
    new User { Name = "张三", Age = 25, Email = "zhangsan@example.com" },
    new User { Name = "李四", Age = 30, Email = "lisi@example.com" }
};
dataGridView.DataSource = users;
```

### 其他控件

```csharp
// PictureBox 图片框
PictureBox pictureBox = new PictureBox
{
    Location = new Point(10, 10),
    Size = new Size(200, 200),
    SizeMode = PictureBoxSizeMode.Zoom,
    Image = Image.FromFile("image.jpg")
};

// ProgressBar 进度条
ProgressBar progressBar = new ProgressBar
{
    Location = new Point(10, 10),
    Size = new Size(300, 20),
    Minimum = 0,
    Maximum = 100,
    Value = 50
};

// TrackBar 滑块
TrackBar trackBar = new TrackBar
{
    Location = new Point(10, 10),
    Size = new Size(300, 45),
    Minimum = 0,
    Maximum = 100,
    Value = 50
};

// DateTimePicker 日期选择
DateTimePicker dateTimePicker = new DateTimePicker
{
    Location = new Point(10, 10),
    Format = DateTimePickerFormat.Short
};

// MonthCalendar 月历
MonthCalendar monthCalendar = new MonthCalendar
{
    Location = new Point(10, 10)
};

// NumericUpDown 数字选择
NumericUpDown numericUpDown = new NumericUpDown
{
    Location = new Point(10, 10),
    Minimum = 0,
    Maximum = 100,
    Value = 50
};
```

## 布局

### 锚定（Anchor）

```csharp
// 控件随窗体大小变化
textBox.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
button.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
```

### 停靠（Dock）

```csharp
// 控件停靠到窗体边缘
panel1.Dock = DockStyle.Top;
panel2.Dock = DockStyle.Left;
panel3.Dock = DockStyle.Fill;
```

### 容器控件

```csharp
// Panel 面板
Panel panel = new Panel
{
    Location = new Point(10, 10),
    Size = new Size(300, 200),
    BorderStyle = BorderStyle.FixedSingle
};

// GroupBox 分组框
GroupBox groupBox = new GroupBox
{
    Text = "用户信息",
    Location = new Point(10, 10),
    Size = new Size(300, 200)
};

// TabControl 选项卡
TabControl tabControl = new TabControl
{
    Location = new Point(10, 10),
    Size = new Size(400, 300)
};

TabPage tabPage1 = new TabPage("页面1");
TabPage tabPage2 = new TabPage("页面2");
tabControl.TabPages.Add(tabPage1);
tabControl.TabPages.Add(tabPage2);

// SplitContainer 分割容器
SplitContainer splitContainer = new SplitContainer
{
    Dock = DockStyle.Fill,
    Orientation = Orientation.Vertical
};
```

### FlowLayoutPanel 流式布局

```csharp
FlowLayoutPanel flowPanel = new FlowLayoutPanel
{
    Dock = DockStyle.Fill,
    FlowDirection = FlowDirection.LeftToRight,
    WrapContents = true
};

for (int i = 0; i < 10; i++)
{
    Button btn = new Button
    {
        Text = $"按钮{i + 1}",
        Size = new Size(80, 30),
        Margin = new Padding(5)
    };
    flowPanel.Controls.Add(btn);
}
```

### TableLayoutPanel 表格布局

```csharp
TableLayoutPanel tablePanel = new TableLayoutPanel
{
    Dock = DockStyle.Fill,
    ColumnCount = 2,
    RowCount = 3
};

tablePanel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 100));
tablePanel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

tablePanel.Controls.Add(new Label { Text = "姓名:" }, 0, 0);
tablePanel.Controls.Add(new TextBox(), 1, 0);
tablePanel.Controls.Add(new Label { Text = "年龄:" }, 0, 1);
tablePanel.Controls.Add(new NumericUpDown(), 1, 1);
```

## 事件处理

### 常用事件

```csharp
// 按钮点击
button.Click += (sender, e) =>
{
    MessageBox.Show("按钮被点击");
};

// 文本改变
textBox.TextChanged += (sender, e) =>
{
    label.Text = textBox.Text;
};

// 窗体加载
this.Load += (sender, e) =>
{
    // 初始化操作
};

// 窗体关闭
this.FormClosing += (sender, e) =>
{
    var result = MessageBox.Show("确定要退出吗？", "确认", 
        MessageBoxButtons.YesNo, MessageBoxIcon.Question);
    if (result == DialogResult.No)
    {
        e.Cancel = true;
    }
};

// 键盘事件
textBox.KeyDown += (sender, e) =>
{
    if (e.KeyCode == Keys.Enter)
    {
        // 处理回车键
    }
};

// 鼠标事件
pictureBox.MouseClick += (sender, e) =>
{
    if (e.Button == MouseButtons.Left)
    {
        // 左键点击
    }
};
```

## 对话框

### MessageBox

```csharp
// 信息提示
MessageBox.Show("操作成功", "提示", 
    MessageBoxButtons.OK, MessageBoxIcon.Information);

// 确认对话框
var result = MessageBox.Show("确定要删除吗？", "确认", 
    MessageBoxButtons.YesNo, MessageBoxIcon.Question);
if (result == DialogResult.Yes)
{
    // 删除操作
}

// 多按钮对话框
var result = MessageBox.Show("是否保存更改？", "提示", 
    MessageBoxButtons.YesNoCancel, MessageBoxIcon.Question);
switch (result)
{
    case DialogResult.Yes:
        // 保存
        break;
    case DialogResult.No:
        // 不保存
        break;
    case DialogResult.Cancel:
        // 取消
        break;
}
```

### OpenFileDialog

```csharp
OpenFileDialog openFileDialog = new OpenFileDialog
{
    Title = "选择文件",
    Filter = "文本文件|*.txt|所有文件|*.*",
    Multiselect = false
};

if (openFileDialog.ShowDialog() == DialogResult.OK)
{
    string fileName = openFileDialog.FileName;
    string content = File.ReadAllText(fileName);
    textBox.Text = content;
}
```

### SaveFileDialog

```csharp
SaveFileDialog saveFileDialog = new SaveFileDialog
{
    Title = "保存文件",
    Filter = "文本文件|*.txt",
    FileName = "document.txt"
};

if (saveFileDialog.ShowDialog() == DialogResult.OK)
{
    string fileName = saveFileDialog.FileName;
    File.WriteAllText(fileName, textBox.Text);
}
```

### FolderBrowserDialog

```csharp
FolderBrowserDialog folderDialog = new FolderBrowserDialog
{
    Description = "选择文件夹"
};

if (folderDialog.ShowDialog() == DialogResult.OK)
{
    string folderPath = folderDialog.SelectedPath;
}
```

### ColorDialog

```csharp
ColorDialog colorDialog = new ColorDialog();
if (colorDialog.ShowDialog() == DialogResult.OK)
{
    textBox.ForeColor = colorDialog.Color;
}
```

### FontDialog

```csharp
FontDialog fontDialog = new FontDialog();
if (fontDialog.ShowDialog() == DialogResult.OK)
{
    textBox.Font = fontDialog.Font;
}
```

### 自定义对话框

```csharp
// 创建对话框窗体
public partial class InputDialog : Form
{
    public string InputText { get; private set; }
    
    public InputDialog()
    {
        InitializeComponent();
    }
    
    private void btnOK_Click(object sender, EventArgs e)
    {
        InputText = txtInput.Text;
        DialogResult = DialogResult.OK;
    }
    
    private void btnCancel_Click(object sender, EventArgs e)
    {
        DialogResult = DialogResult.Cancel;
    }
}

// 使用对话框
InputDialog dialog = new InputDialog();
if (dialog.ShowDialog() == DialogResult.OK)
{
    string input = dialog.InputText;
}
```

## 数据绑定

### 简单绑定

```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

Person person = new Person { Name = "张三", Age = 25 };

// 绑定到控件
textBox.DataBindings.Add("Text", person, "Name");
numericUpDown.DataBindings.Add("Value", person, "Age");
```

### BindingSource

```csharp
List<User> users = new List<User>
{
    new User { Name = "张三", Age = 25 },
    new User { Name = "李四", Age = 30 }
};

BindingSource bindingSource = new BindingSource
{
    DataSource = users
};

// 绑定到 DataGridView
dataGridView.DataSource = bindingSource;

// 绑定到文本框
textBox.DataBindings.Add("Text", bindingSource, "Name");
numericUpDown.DataBindings.Add("Value", bindingSource, "Age");

// 导航
bindingSource.MoveNext();
bindingSource.MovePrevious();
bindingSource.MoveFirst();
bindingSource.MoveLast();
```

## 菜单和工具栏

### MenuStrip 菜单

```csharp
MenuStrip menuStrip = new MenuStrip();

// 文件菜单
ToolStripMenuItem fileMenu = new ToolStripMenuItem("文件(&F)");
fileMenu.DropDownItems.Add("新建(&N)", null, (s, e) => { /* 新建 */ });
fileMenu.DropDownItems.Add("打开(&O)", null, (s, e) => { /* 打开 */ });
fileMenu.DropDownItems.Add(new ToolStripSeparator());
fileMenu.DropDownItems.Add("退出(&X)", null, (s, e) => Close());

// 编辑菜单
ToolStripMenuItem editMenu = new ToolStripMenuItem("编辑(&E)");
editMenu.DropDownItems.Add("复制(&C)", null, (s, e) => { /* 复制 */ });
editMenu.DropDownItems.Add("粘贴(&V)", null, (s, e) => { /* 粘贴 */ });

menuStrip.Items.Add(fileMenu);
menuStrip.Items.Add(editMenu);

this.Controls.Add(menuStrip);
this.MainMenuStrip = menuStrip;
```

### ToolStrip 工具栏

```csharp
ToolStrip toolStrip = new ToolStrip();

// 添加按钮
ToolStripButton newButton = new ToolStripButton
{
    Text = "新建",
    Image = Image.FromFile("new.png")
};
newButton.Click += (s, e) => { /* 新建 */ };

ToolStripButton openButton = new ToolStripButton
{
    Text = "打开",
    Image = Image.FromFile("open.png")
};
openButton.Click += (s, e) => { /* 打开 */ };

toolStrip.Items.Add(newButton);
toolStrip.Items.Add(openButton);
toolStrip.Items.Add(new ToolStripSeparator());

this.Controls.Add(toolStrip);
```

### StatusStrip 状态栏

```csharp
StatusStrip statusStrip = new StatusStrip();

ToolStripStatusLabel statusLabel = new ToolStripStatusLabel
{
    Text = "就绪",
    Spring = true,
    TextAlign = ContentAlignment.MiddleLeft
};

ToolStripProgressBar progressBar = new ToolStripProgressBar
{
    Visible = false
};

statusStrip.Items.Add(statusLabel);
statusStrip.Items.Add(progressBar);

this.Controls.Add(statusStrip);
```

### ContextMenuStrip 右键菜单

```csharp
ContextMenuStrip contextMenu = new ContextMenuStrip();
contextMenu.Items.Add("复制", null, (s, e) => { /* 复制 */ });
contextMenu.Items.Add("粘贴", null, (s, e) => { /* 粘贴 */ });
contextMenu.Items.Add(new ToolStripSeparator());
contextMenu.Items.Add("删除", null, (s, e) => { /* 删除 */ });

textBox.ContextMenuStrip = contextMenu;
```

## 多线程

### BackgroundWorker

```csharp
BackgroundWorker worker = new BackgroundWorker
{
    WorkerReportsProgress = true,
    WorkerSupportsCancellation = true
};

worker.DoWork += (s, e) =>
{
    for (int i = 0; i <= 100; i++)
    {
        if (worker.CancellationPending)
        {
            e.Cancel = true;
            return;
        }
        
        Thread.Sleep(100);
        worker.ReportProgress(i);
    }
};

worker.ProgressChanged += (s, e) =>
{
    progressBar.Value = e.ProgressPercentage;
    label.Text = $"{e.ProgressPercentage}%";
};

worker.RunWorkerCompleted += (s, e) =>
{
    if (e.Cancelled)
    {
        MessageBox.Show("操作已取消");
    }
    else if (e.Error != null)
    {
        MessageBox.Show($"错误: {e.Error.Message}");
    }
    else
    {
        MessageBox.Show("操作完成");
    }
};

// 启动
worker.RunWorkerAsync();

// 取消
worker.CancelAsync();
```

### async/await

```csharp
private async void btnLoad_Click(object sender, EventArgs e)
{
    btnLoad.Enabled = false;
    progressBar.Visible = true;
    
    try
    {
        var data = await LoadDataAsync();
        dataGridView.DataSource = data;
    }
    catch (Exception ex)
    {
        MessageBox.Show($"错误: {ex.Message}");
    }
    finally
    {
        btnLoad.Enabled = true;
        progressBar.Visible = false;
    }
}

private async Task<List<User>> LoadDataAsync()
{
    await Task.Delay(2000);  // 模拟耗时操作
    return new List<User>();
}
```

## 最佳实践

### 使用 MVC/MVP 模式

```csharp
// Model
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}

// View Interface
public interface IUserView
{
    string UserName { get; set; }
    string Email { get; set; }
    event EventHandler SaveClicked;
    void ShowMessage(string message);
}

// Presenter
public class UserPresenter
{
    private readonly IUserView _view;
    private readonly IUserService _userService;
    
    public UserPresenter(IUserView view, IUserService userService)
    {
        _view = view;
        _userService = userService;
        _view.SaveClicked += OnSaveClicked;
    }
    
    private void OnSaveClicked(object sender, EventArgs e)
    {
        var user = new User
        {
            Name = _view.UserName,
            Email = _view.Email
        };
        
        _userService.Save(user);
        _view.ShowMessage("保存成功");
    }
}

// Form (View)
public partial class UserForm : Form, IUserView
{
    private readonly UserPresenter _presenter;
    
    public UserForm(IUserService userService)
    {
        InitializeComponent();
        _presenter = new UserPresenter(this, userService);
    }
    
    public string UserName
    {
        get => txtName.Text;
        set => txtName.Text = value;
    }
    
    public string Email
    {
        get => txtEmail.Text;
        set => txtEmail.Text = value;
    }
    
    public event EventHandler SaveClicked;
    
    private void btnSave_Click(object sender, EventArgs e)
    {
        SaveClicked?.Invoke(this, EventArgs.Empty);
    }
    
    public void ShowMessage(string message)
    {
        MessageBox.Show(message);
    }
}
```

### 依赖注入

```csharp
// Program.cs
var services = new ServiceCollection();
services.AddSingleton<IUserService, UserService>();
services.AddTransient<UserForm>();

var serviceProvider = services.BuildServiceProvider();
var mainForm = serviceProvider.GetRequiredService<UserForm>();

Application.Run(mainForm);
```

### 资源管理

```csharp
// 使用 using 语句
using (var bitmap = new Bitmap("image.jpg"))
{
    pictureBox.Image = bitmap;
}

// 或实现 IDisposable
public class MyForm : Form
{
    private Timer _timer;
    
    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            _timer?.Dispose();
        }
        base.Dispose(disposing);
    }
}
```
