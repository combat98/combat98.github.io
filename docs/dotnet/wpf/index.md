# WPF

## 概述

WPF（Windows Presentation Foundation）是微软推出的桌面应用程序开发框架，基于 DirectX，提供了丰富的 UI 控件和强大的数据绑定功能。

### 核心特性

- XAML 声明式 UI
- 数据绑定
- 样式和模板
- 动画和多媒体
- 2D/3D 图形
- MVVM 架构支持

## 快速开始

### 创建项目

```bash
dotnet new wpf -n MyWpfApp
cd MyWpfApp
dotnet run
```

### 项目结构

```
MyWpfApp/
├── App.xaml              # 应用程序定义
├── App.xaml.cs           # 应用程序代码
├── MainWindow.xaml       # 主窗口 UI
├── MainWindow.xaml.cs    # 主窗口代码
└── MyWpfApp.csproj       # 项目文件
```

### MainWindow.xaml

```xml
<Window x:Class="MyWpfApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="我的应用" Height="450" Width="800">
    <Grid>
        <TextBlock Text="Hello WPF!" 
                   HorizontalAlignment="Center" 
                   VerticalAlignment="Center"
                   FontSize="24"/>
    </Grid>
</Window>
```

## 布局

### Grid 网格布局

```xml
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="*"/>
        <RowDefinition Height="Auto"/>
    </Grid.RowDefinitions>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="200"/>
        <ColumnDefinition Width="*"/>
    </Grid.ColumnDefinitions>
    
    <TextBlock Grid.Row="0" Grid.Column="0" Text="标题"/>
    <TextBox Grid.Row="0" Grid.Column="1"/>
    <ListBox Grid.Row="1" Grid.Column="0"/>
    <TextBox Grid.Row="1" Grid.Column="1" AcceptsReturn="True"/>
    <Button Grid.Row="2" Grid.ColumnSpan="2" Content="提交"/>
</Grid>
```

### StackPanel 堆栈布局

```xml
<!-- 垂直堆栈 -->
<StackPanel Orientation="Vertical">
    <TextBlock Text="姓名:"/>
    <TextBox/>
    <TextBlock Text="年龄:"/>
    <TextBox/>
    <Button Content="提交"/>
</StackPanel>

<!-- 水平堆栈 -->
<StackPanel Orientation="Horizontal">
    <Button Content="确定" Margin="5"/>
    <Button Content="取消" Margin="5"/>
</StackPanel>
```

### WrapPanel 自动换行

```xml
<WrapPanel>
    <Button Content="按钮1" Width="100" Height="30" Margin="5"/>
    <Button Content="按钮2" Width="100" Height="30" Margin="5"/>
    <Button Content="按钮3" Width="100" Height="30" Margin="5"/>
    <Button Content="按钮4" Width="100" Height="30" Margin="5"/>
</WrapPanel>
```

### DockPanel 停靠布局

```xml
<DockPanel LastChildFill="True">
    <Menu DockPanel.Dock="Top">
        <MenuItem Header="文件"/>
        <MenuItem Header="编辑"/>
    </Menu>
    <StatusBar DockPanel.Dock="Bottom">
        <TextBlock Text="就绪"/>
    </StatusBar>
    <TreeView DockPanel.Dock="Left" Width="200"/>
    <TextBox AcceptsReturn="True"/>
</DockPanel>
```

### Canvas 绝对定位

```xml
<Canvas>
    <Button Content="按钮1" Canvas.Left="50" Canvas.Top="50"/>
    <Button Content="按钮2" Canvas.Left="150" Canvas.Top="100"/>
    <Ellipse Fill="Red" Width="100" Height="100" 
             Canvas.Left="200" Canvas.Top="150"/>
</Canvas>
```

## 常用控件

### 文本控件

```xml
<!-- TextBlock 只读文本 -->
<TextBlock Text="这是文本" FontSize="16" FontWeight="Bold"/>

<!-- TextBox 文本输入 -->
<TextBox Text="输入文本" Width="200"/>

<!-- PasswordBox 密码输入 -->
<PasswordBox Width="200"/>

<!-- RichTextBox 富文本 -->
<RichTextBox Height="200"/>
```

### 按钮控件

```xml
<!-- Button 普通按钮 -->
<Button Content="点击我" Click="Button_Click"/>

<!-- RepeatButton 重复按钮 -->
<RepeatButton Content="按住不放" Click="RepeatButton_Click"/>

<!-- ToggleButton 切换按钮 -->
<ToggleButton Content="切换" IsChecked="True"/>

<!-- CheckBox 复选框 -->
<CheckBox Content="同意条款" IsChecked="True"/>

<!-- RadioButton 单选按钮 -->
<StackPanel>
    <RadioButton Content="男" GroupName="Gender" IsChecked="True"/>
    <RadioButton Content="女" GroupName="Gender"/>
</StackPanel>
```

### 列表控件

```xml
<!-- ListBox 列表框 -->
<ListBox>
    <ListBoxItem Content="项目1"/>
    <ListBoxItem Content="项目2"/>
    <ListBoxItem Content="项目3"/>
</ListBox>

<!-- ComboBox 下拉框 -->
<ComboBox>
    <ComboBoxItem Content="选项1"/>
    <ComboBoxItem Content="选项2" IsSelected="True"/>
    <ComboBoxItem Content="选项3"/>
</ComboBox>

<!-- ListView 列表视图 -->
<ListView>
    <ListView.View>
        <GridView>
            <GridViewColumn Header="姓名" DisplayMemberBinding="{Binding Name}"/>
            <GridViewColumn Header="年龄" DisplayMemberBinding="{Binding Age}"/>
        </GridView>
    </ListView.View>
</ListView>

<!-- DataGrid 数据表格 -->
<DataGrid ItemsSource="{Binding Users}" AutoGenerateColumns="False">
    <DataGrid.Columns>
        <DataGridTextColumn Header="姓名" Binding="{Binding Name}"/>
        <DataGridTextColumn Header="年龄" Binding="{Binding Age}"/>
    </DataGrid.Columns>
</DataGrid>
```

### 其他控件

```xml
<!-- Image 图片 -->
<Image Source="/Images/logo.png" Width="100" Height="100"/>

<!-- ProgressBar 进度条 -->
<ProgressBar Value="50" Maximum="100" Height="20"/>

<!-- Slider 滑块 -->
<Slider Minimum="0" Maximum="100" Value="50"/>

<!-- DatePicker 日期选择 -->
<DatePicker SelectedDate="{Binding BirthDate}"/>

<!-- Calendar 日历 -->
<Calendar SelectedDate="{Binding SelectedDate}"/>
```

## 数据绑定

### 简单绑定

```xml
<TextBox x:Name="txtInput"/>
<TextBlock Text="{Binding ElementName=txtInput, Path=Text}"/>
```

### 绑定到对象

```csharp
// C# 代码
public class Person : INotifyPropertyChanged
{
    private string _name;
    public string Name
    {
        get => _name;
        set
        {
            _name = value;
            OnPropertyChanged(nameof(Name));
        }
    }
    
    public event PropertyChangedEventHandler PropertyChanged;
    
    protected void OnPropertyChanged(string propertyName)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}

// MainWindow.xaml.cs
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        DataContext = new Person { Name = "张三" };
    }
}
```

```xml
<!-- XAML -->
<TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}"/>
<TextBlock Text="{Binding Name}"/>
```

### 绑定模式

```xml
<!-- OneWay：单向绑定（默认） -->
<TextBlock Text="{Binding Name, Mode=OneWay}"/>

<!-- TwoWay：双向绑定 -->
<TextBox Text="{Binding Name, Mode=TwoWay}"/>

<!-- OneTime：一次性绑定 -->
<TextBlock Text="{Binding Name, Mode=OneTime}"/>

<!-- OneWayToSource：反向绑定 -->
<Slider Value="{Binding Volume, Mode=OneWayToSource}"/>
```

### 值转换器

```csharp
public class BoolToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return (bool)value ? Visibility.Visible : Visibility.Collapsed;
    }
    
    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return (Visibility)value == Visibility.Visible;
    }
}
```

```xml
<Window.Resources>
    <local:BoolToVisibilityConverter x:Key="BoolToVisibilityConverter"/>
</Window.Resources>

<TextBlock Text="显示" 
           Visibility="{Binding IsVisible, Converter={StaticResource BoolToVisibilityConverter}}"/>
```

## MVVM 模式

### Model

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
}
```

### ViewModel

```csharp
public class MainViewModel : INotifyPropertyChanged
{
    private ObservableCollection<User> _users;
    public ObservableCollection<User> Users
    {
        get => _users;
        set
        {
            _users = value;
            OnPropertyChanged(nameof(Users));
        }
    }
    
    private User _selectedUser;
    public User SelectedUser
    {
        get => _selectedUser;
        set
        {
            _selectedUser = value;
            OnPropertyChanged(nameof(SelectedUser));
        }
    }
    
    public ICommand AddCommand { get; }
    public ICommand DeleteCommand { get; }
    
    public MainViewModel()
    {
        Users = new ObservableCollection<User>();
        AddCommand = new RelayCommand(Add);
        DeleteCommand = new RelayCommand(Delete, CanDelete);
    }
    
    private void Add()
    {
        Users.Add(new User { Name = "新用户" });
    }
    
    private void Delete()
    {
        if (SelectedUser != null)
        {
            Users.Remove(SelectedUser);
        }
    }
    
    private bool CanDelete()
    {
        return SelectedUser != null;
    }
    
    public event PropertyChangedEventHandler PropertyChanged;
    
    protected void OnPropertyChanged(string propertyName)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

### RelayCommand

```csharp
public class RelayCommand : ICommand
{
    private readonly Action _execute;
    private readonly Func<bool> _canExecute;
    
    public RelayCommand(Action execute, Func<bool> canExecute = null)
    {
        _execute = execute ?? throw new ArgumentNullException(nameof(execute));
        _canExecute = canExecute;
    }
    
    public bool CanExecute(object parameter)
    {
        return _canExecute == null || _canExecute();
    }
    
    public void Execute(object parameter)
    {
        _execute();
    }
    
    public event EventHandler CanExecuteChanged
    {
        add { CommandManager.RequerySuggested += value; }
        remove { CommandManager.RequerySuggested -= value; }
    }
}
```

### View

```xml
<Window x:Class="MyWpfApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:local="clr-namespace:MyWpfApp"
        Title="用户管理" Height="450" Width="800">
    <Window.DataContext>
        <local:MainViewModel/>
    </Window.DataContext>
    
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        
        <DataGrid Grid.Row="0" ItemsSource="{Binding Users}" 
                  SelectedItem="{Binding SelectedUser}"
                  AutoGenerateColumns="False">
            <DataGrid.Columns>
                <DataGridTextColumn Header="姓名" Binding="{Binding Name}"/>
                <DataGridTextColumn Header="邮箱" Binding="{Binding Email}"/>
                <DataGridTextColumn Header="年龄" Binding="{Binding Age}"/>
            </DataGrid.Columns>
        </DataGrid>
        
        <StackPanel Grid.Row="1" Orientation="Horizontal" Margin="5">
            <Button Content="添加" Command="{Binding AddCommand}" Margin="5"/>
            <Button Content="删除" Command="{Binding DeleteCommand}" Margin="5"/>
        </StackPanel>
    </Grid>
</Window>
```

## 样式和模板

### 样式

```xml
<Window.Resources>
    <!-- 定义样式 -->
    <Style x:Key="PrimaryButton" TargetType="Button">
        <Setter Property="Background" Value="#007ACC"/>
        <Setter Property="Foreground" Value="White"/>
        <Setter Property="Padding" Value="10,5"/>
        <Setter Property="FontSize" Value="14"/>
        <Setter Property="Cursor" Value="Hand"/>
        <Style.Triggers>
            <Trigger Property="IsMouseOver" Value="True">
                <Setter Property="Background" Value="#005A9E"/>
            </Trigger>
        </Style.Triggers>
    </Style>
</Window.Resources>

<!-- 使用样式 -->
<Button Content="主要按钮" Style="{StaticResource PrimaryButton}"/>
```

### 控件模板

```xml
<Window.Resources>
    <ControlTemplate x:Key="RoundButton" TargetType="Button">
        <Border Background="{TemplateBinding Background}"
                BorderBrush="{TemplateBinding BorderBrush}"
                BorderThickness="{TemplateBinding BorderThickness}"
                CornerRadius="15">
            <ContentPresenter HorizontalAlignment="Center" 
                            VerticalAlignment="Center"/>
        </Border>
    </ControlTemplate>
</Window.Resources>

<Button Content="圆角按钮" 
        Template="{StaticResource RoundButton}"
        Background="#007ACC"
        Foreground="White"
        Width="100" Height="30"/>
```

### 数据模板

```xml
<ListBox ItemsSource="{Binding Users}">
    <ListBox.ItemTemplate>
        <DataTemplate>
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="{Binding Name}" FontWeight="Bold" Margin="5"/>
                <TextBlock Text="{Binding Email}" Foreground="Gray" Margin="5"/>
            </StackPanel>
        </DataTemplate>
    </ListBox.ItemTemplate>
</ListBox>
```

## 对话框

### MessageBox

```csharp
// 信息提示
MessageBox.Show("操作成功", "提示", MessageBoxButton.OK, MessageBoxImage.Information);

// 确认对话框
var result = MessageBox.Show("确定要删除吗？", "确认", 
    MessageBoxButton.YesNo, MessageBoxImage.Question);
if (result == MessageBoxResult.Yes)
{
    // 删除操作
}
```

### OpenFileDialog

```csharp
var dialog = new OpenFileDialog
{
    Title = "选择文件",
    Filter = "文本文件|*.txt|所有文件|*.*",
    Multiselect = false
};

if (dialog.ShowDialog() == true)
{
    var fileName = dialog.FileName;
    // 处理文件
}
```

### SaveFileDialog

```csharp
var dialog = new SaveFileDialog
{
    Title = "保存文件",
    Filter = "文本文件|*.txt",
    FileName = "document.txt"
};

if (dialog.ShowDialog() == true)
{
    var fileName = dialog.FileName;
    // 保存文件
}
```

### 自定义对话框

```xml
<!-- DialogWindow.xaml -->
<Window x:Class="MyWpfApp.DialogWindow"
        Title="对话框" Height="200" Width="400"
        WindowStartupLocation="CenterOwner">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>
        
        <TextBox x:Name="txtInput" Margin="10"/>
        
        <StackPanel Grid.Row="1" Orientation="Horizontal" 
                    HorizontalAlignment="Right" Margin="10">
            <Button Content="确定" Click="OK_Click" Width="80" Margin="5"/>
            <Button Content="取消" Click="Cancel_Click" Width="80" Margin="5"/>
        </StackPanel>
    </Grid>
</Window>
```

```csharp
// DialogWindow.xaml.cs
public partial class DialogWindow : Window
{
    public string InputText { get; private set; }
    
    public DialogWindow()
    {
        InitializeComponent();
    }
    
    private void OK_Click(object sender, RoutedEventArgs e)
    {
        InputText = txtInput.Text;
        DialogResult = true;
    }
    
    private void Cancel_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = false;
    }
}

// 使用
var dialog = new DialogWindow();
if (dialog.ShowDialog() == true)
{
    var input = dialog.InputText;
}
```

## 多线程

### Dispatcher

```csharp
private async void Button_Click(object sender, RoutedEventArgs e)
{
    await Task.Run(() =>
    {
        // 后台线程
        Thread.Sleep(2000);
        
        // 更新 UI（必须在 UI 线程）
        Dispatcher.Invoke(() =>
        {
            txtStatus.Text = "完成";
        });
    });
}
```

### async/await

```csharp
private async void LoadData_Click(object sender, RoutedEventArgs e)
{
    btnLoad.IsEnabled = false;
    progressBar.Visibility = Visibility.Visible;
    
    try
    {
        var data = await LoadDataAsync();
        dataGrid.ItemsSource = data;
    }
    finally
    {
        btnLoad.IsEnabled = true;
        progressBar.Visibility = Visibility.Collapsed;
    }
}

private async Task<List<User>> LoadDataAsync()
{
    await Task.Delay(2000);  // 模拟耗时操作
    return new List<User>();
}
```

## 最佳实践

### 使用 MVVM 框架

推荐使用成熟的 MVVM 框架：
- **Prism**：功能强大，模块化
- **MVVM Light**：轻量级
- **CommunityToolkit.Mvvm**：微软官方

```bash
dotnet add package CommunityToolkit.Mvvm
```

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private string _name;
    
    [ObservableProperty]
    private int _age;
    
    [RelayCommand]
    private void Save()
    {
        // 保存逻辑
    }
    
    [RelayCommand(CanExecute = nameof(CanDelete))]
    private void Delete()
    {
        // 删除逻辑
    }
    
    private bool CanDelete() => Age > 0;
}
```

### 资源字典

```xml
<!-- Styles.xaml -->
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Style x:Key="PrimaryButton" TargetType="Button">
        <!-- 样式定义 -->
    </Style>
</ResourceDictionary>

<!-- App.xaml -->
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Styles.xaml"/>
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

### 依赖注入

```csharp
// Program.cs (.NET 6+)
var host = Host.CreateDefaultBuilder()
    .ConfigureServices((context, services) =>
    {
        services.AddSingleton<MainWindow>();
        services.AddSingleton<MainViewModel>();
        services.AddScoped<IUserService, UserService>();
    })
    .Build();

var mainWindow = host.Services.GetRequiredService<MainWindow>();
mainWindow.Show();
```
