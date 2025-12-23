# Scikit-learn

## 简介

Scikit-learn 是 Python 最流行的机器学习库，提供了简单高效的数据挖掘和数据分析工具。

### 特点

- 简单高效的数据挖掘和分析工具
- 建立在 NumPy、SciPy 和 Matplotlib 之上
- 开源，商业可用（BSD 许可证）
- 丰富的机器学习算法

### 安装

```bash
pip install scikit-learn
```

## 基础使用

### 导入库

```python
import numpy as np
import pandas as pd
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
```

### 加载数据集

```python
# 加载内置数据集
from sklearn.datasets import load_iris, load_boston, load_digits

# 鸢尾花数据集
iris = load_iris()
X, y = iris.data, iris.target

# 波士顿房价数据集
# boston = load_boston()

# 手写数字数据集
digits = load_digits()

# 生成模拟数据
from sklearn.datasets import make_classification, make_regression

X, y = make_classification(n_samples=1000, n_features=20, n_classes=2)
X, y = make_regression(n_samples=1000, n_features=10)
```

## 数据预处理

### 数据分割

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### 特征缩放

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# 标准化（均值为0，标准差为1）
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 归一化（缩放到0-1之间）
scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

### 特征编码

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# 标签编码
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# 独热编码
from sklearn.preprocessing import OneHotEncoder
encoder = OneHotEncoder(sparse=False)
X_encoded = encoder.fit_transform(X)

# Pandas 方式
import pandas as pd
df_encoded = pd.get_dummies(df, columns=['category'])
```

### 缺失值处理

```python
from sklearn.impute import SimpleImputer

# 用均值填充
imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)

# 用中位数填充
imputer = SimpleImputer(strategy='median')

# 用最频繁值填充
imputer = SimpleImputer(strategy='most_frequent')
```

## 监督学习

### 线性回归

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 创建模型
model = LinearRegression()

# 训练模型
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 评估
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'MSE: {mse}')
print(f'R2 Score: {r2}')

# 查看系数
print('Coefficients:', model.coef_)
print('Intercept:', model.intercept_)
```

### 逻辑回归

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# 创建模型
model = LogisticRegression()

# 训练模型
model.fit(X_train, y_train)

# 预测
y_pred = model.predict(X_test)

# 预测概率
y_proba = model.predict_proba(X_test)

# 评估
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy}')
print(classification_report(y_test, y_pred))
```

### 决策树

```python
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

# 分类树
clf = DecisionTreeClassifier(max_depth=5, random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# 回归树
reg = DecisionTreeRegressor(max_depth=5, random_state=42)
reg.fit(X_train, y_train)
y_pred = reg.predict(X_test)

# 可视化决策树
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(20, 10))
plot_tree(clf, filled=True, feature_names=iris.feature_names, 
          class_names=iris.target_names)
plt.show()
```

### 随机森林

```python
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# 分类
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# 特征重要性
importances = clf.feature_importances_
print('Feature Importances:', importances)

# 回归
reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train, y_train)
y_pred = reg.predict(X_test)
```

### 支持向量机（SVM）

```python
from sklearn.svm import SVC, SVR

# 分类
clf = SVC(kernel='rbf', C=1.0, gamma='scale')
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# 回归
reg = SVR(kernel='rbf', C=1.0, gamma='scale')
reg.fit(X_train, y_train)
y_pred = reg.predict(X_test)
```

### K近邻（KNN）

```python
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor

# 分类
clf = KNeighborsClassifier(n_neighbors=5)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# 回归
reg = KNeighborsRegressor(n_neighbors=5)
reg.fit(X_train, y_train)
y_pred = reg.predict(X_test)
```

### 朴素贝叶斯

```python
from sklearn.naive_bayes import GaussianNB, MultinomialNB

# 高斯朴素贝叶斯
clf = GaussianNB()
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# 多项式朴素贝叶斯（用于文本分类）
clf = MultinomialNB()
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
```

### 梯度提升

```python
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor

# 分类
clf = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, 
                                  max_depth=3, random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# 回归
reg = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, 
                                 max_depth=3, random_state=42)
reg.fit(X_train, y_train)
y_pred = reg.predict(X_test)
```

## 无监督学习

### K-Means 聚类

```python
from sklearn.cluster import KMeans

# 创建模型
kmeans = KMeans(n_clusters=3, random_state=42)

# 训练模型
kmeans.fit(X)

# 预测
labels = kmeans.predict(X)

# 聚类中心
centers = kmeans.cluster_centers_

# 可视化
import matplotlib.pyplot as plt
plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis')
plt.scatter(centers[:, 0], centers[:, 1], c='red', marker='x', s=200)
plt.show()
```

### 层次聚类

```python
from sklearn.cluster import AgglomerativeClustering

# 创建模型
clustering = AgglomerativeClustering(n_clusters=3)

# 训练模型
labels = clustering.fit_predict(X)
```

### DBSCAN

```python
from sklearn.cluster import DBSCAN

# 创建模型
dbscan = DBSCAN(eps=0.5, min_samples=5)

# 训练模型
labels = dbscan.fit_predict(X)
```

### 主成分分析（PCA）

```python
from sklearn.decomposition import PCA

# 创建模型
pca = PCA(n_components=2)

# 降维
X_pca = pca.fit_transform(X)

# 解释方差比
print('Explained Variance Ratio:', pca.explained_variance_ratio_)

# 可视化
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis')
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.show()
```

## 模型评估

### 分类指标

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score, roc_curve
)

# 准确率
accuracy = accuracy_score(y_test, y_pred)

# 精确率
precision = precision_score(y_test, y_pred, average='weighted')

# 召回率
recall = recall_score(y_test, y_pred, average='weighted')

# F1分数
f1 = f1_score(y_test, y_pred, average='weighted')

# 混淆矩阵
cm = confusion_matrix(y_test, y_pred)
print(cm)

# 分类报告
report = classification_report(y_test, y_pred)
print(report)

# ROC-AUC
y_proba = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_proba)

# ROC曲线
fpr, tpr, thresholds = roc_curve(y_test, y_proba)
plt.plot(fpr, tpr)
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.show()
```

### 回归指标

```python
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score
)

# 均方误差
mse = mean_squared_error(y_test, y_pred)

# 均方根误差
rmse = np.sqrt(mse)

# 平均绝对误差
mae = mean_absolute_error(y_test, y_pred)

# R2分数
r2 = r2_score(y_test, y_pred)

print(f'MSE: {mse}')
print(f'RMSE: {rmse}')
print(f'MAE: {mae}')
print(f'R2: {r2}')
```

### 交叉验证

```python
from sklearn.model_selection import cross_val_score, cross_validate

# K折交叉验证
scores = cross_val_score(model, X, y, cv=5)
print('Cross-validation scores:', scores)
print('Mean score:', scores.mean())

# 多指标交叉验证
scoring = ['accuracy', 'precision_weighted', 'recall_weighted']
scores = cross_validate(model, X, y, cv=5, scoring=scoring)
print(scores)
```

## 超参数调优

### 网格搜索

```python
from sklearn.model_selection import GridSearchCV

# 定义参数网格
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 7],
    'min_samples_split': [2, 5, 10]
}

# 创建网格搜索
grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1
)

# 训练
grid_search.fit(X_train, y_train)

# 最佳参数
print('Best parameters:', grid_search.best_params_)
print('Best score:', grid_search.best_score_)

# 使用最佳模型
best_model = grid_search.best_estimator_
```

### 随机搜索

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint

# 定义参数分布
param_dist = {
    'n_estimators': randint(50, 200),
    'max_depth': randint(3, 10),
    'min_samples_split': randint(2, 20)
}

# 创建随机搜索
random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_dist,
    n_iter=20,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42
)

# 训练
random_search.fit(X_train, y_train)

# 最佳参数
print('Best parameters:', random_search.best_params_)
```

## 管道（Pipeline）

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression

# 创建管道
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=2)),
    ('classifier', LogisticRegression())
])

# 训练
pipeline.fit(X_train, y_train)

# 预测
y_pred = pipeline.predict(X_test)

# 管道与网格搜索结合
param_grid = {
    'pca__n_components': [2, 3, 4],
    'classifier__C': [0.1, 1, 10]
}

grid_search = GridSearchCV(pipeline, param_grid, cv=5)
grid_search.fit(X_train, y_train)
```

## 模型持久化

```python
import joblib

# 保存模型
joblib.dump(model, 'model.pkl')

# 加载模型
loaded_model = joblib.load('model.pkl')

# 使用加载的模型
y_pred = loaded_model.predict(X_test)
```

## 最佳实践

1. **数据预处理** - 标准化、归一化
2. **特征工程** - 特征选择、特征提取
3. **交叉验证** - 评估模型泛化能力
4. **超参数调优** - 网格搜索、随机搜索
5. **使用管道** - 简化工作流程
6. **模型集成** - 提高预测性能

## 常见问题

### 1. 过拟合

```python
# 使用正则化
from sklearn.linear_model import Ridge, Lasso

# L2正则化
ridge = Ridge(alpha=1.0)

# L1正则化
lasso = Lasso(alpha=1.0)

# 减少模型复杂度
clf = DecisionTreeClassifier(max_depth=3)

# 增加训练数据
# 使用交叉验证
```

### 2. 类别不平衡

```python
from sklearn.utils import resample
from imblearn.over_sampling import SMOTE

# 重采样
# 上采样少数类
minority_upsampled = resample(minority_class, 
                              n_samples=len(majority_class),
                              random_state=42)

# SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# 使用类权重
clf = RandomForestClassifier(class_weight='balanced')
```

## 参考资源

- [Scikit-learn 官方文档](https://scikit-learn.org/stable/)
- [Scikit-learn 中文文档](https://sklearn.apachecn.org/)
- [Scikit-learn 教程](https://scikit-learn.org/stable/tutorial/index.html)
