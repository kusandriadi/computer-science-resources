---
marp: true
theme: default
paginate: true
header: 'AI Engineering Syllabus'
footer: 'cs.kusandriadi.com'
---

# Machine Learning

**Understand the theory, master the math, build the models**

- Audience: Students with Python fundamentals and basic algebra/statistics
- Math is taught just-in-time -- exactly when you need it
- Prerequisite for Generative AI Engineering (Semester 2)

---

# Course Overview

- Ever wondered how Netflix knows what you want to watch, or how your phone unlocks with your face? That's machine learning
- Learn how these systems actually work -- and build your own
- Every formula is introduced at the moment it becomes useful
- Covers classical ML, neural networks, and reinforcement learning
- From raw data to deployed models with responsible AI baked in

---

# Prerequisites & Self-Check

**Prerequisites:** Python fundamentals, basic algebra and statistics

**Can you:**
- [ ] Write a Python function that takes inputs and returns a result?
- [ ] Use a `for` loop to go through a list of items?
- [ ] Create and use a Python dictionary (key-value pairs)?
- [ ] Read a simple graph (x-axis, y-axis)?
- [ ] Solve: if y = 2x + 3, what is y when x = 5?

If not, Week 0 has you covered!

---

# Tools & Technologies

- **Core:** Python, NumPy, Pandas, Matplotlib
- **ML:** scikit-learn, PyTorch
- **Deployment:** FastAPI
- **Tracking:** MLflow
- **RL:** OpenAI Gymnasium
- **Workflow:** Git

---

# Week 0: Python & Math Refresher

*Making sure everyone starts on the same page, no matter your background.*

- Python basics recap: variables, data types, loops, functions, lists, dictionaries
- Jupyter Notebook setup and workflow
- Math refresher: basic algebra, reading graphs, what is a function f(x)
- NumPy basics: arrays, operations, indexing

**What You'll Build:**
- Set up your Python environment and run your first Jupyter Notebook
- Complete a guided Python exercise with lists, dictionaries, and functions

---

# Week 1: What is Machine Learning?

- AI vs ML vs Deep Learning -- what's the difference and why it matters
- Types of ML: classification, regression, clustering, generation
- The ML workflow: problem definition, data, features, training, evaluation, deployment
- When NOT to use ML -- some problems are better solved with traditional programming
- **Math:** Linear algebra intro -- vectors, matrices, dot product

**What You'll Build:**
- Map out a complete ML pipeline for a real-world problem
- Set up Python environment with Jupyter, NumPy, Pandas, Git

---

# Week 2: Supervised Learning -- Regression

- What is supervised learning? Learning from labeled data
- Linear regression: fitting a line to data, the concept of "best fit"
- Single variable vs multiple variable regression
- **Math:** Derivatives, cost function (MSE -- how far off predictions are), gradient descent (finding the best answer step by step)

**What You'll Build:**
- Implement linear regression from scratch in NumPy
- Predict house prices using scikit-learn
- Visualize cost function decreasing over iterations

---

# Week 3: Supervised Learning -- Classification

- From regression to classification: predicting categories instead of numbers
- Logistic regression: how a regression model becomes a classifier
- Decision boundaries: linear and non-linear
- Confusion matrix: true/false positives and negatives
- **Math:** Sigmoid function (squashing outputs into probabilities), log-loss / cross-entropy

**What You'll Build:**
- Build a spam classifier from scratch
- Visualize decision boundaries for different datasets

---

# Week 4: Model Evaluation

- The fundamental challenge: overfitting vs underfitting
- Train/validation/test splits -- why we split data
- Cross-validation (testing on different slices): k-fold, stratified k-fold
- Metrics: accuracy, precision, recall, F1-score, AUC-ROC
- Hyperparameter tuning (adjusting model "settings"): grid search, random search

**What You'll Build:**
- Compare multiple models with proper validation
- Build an evaluation pipeline that selects the best model automatically

---

# Week 5: Tree-Based Models

- Decision trees: how they split data to make decisions
- Random Forest: combining many weak learners (bagging)
- Gradient Boosting: learning from mistakes sequentially (boosting)
- XGBoost: the industry workhorse for tabular data
- **Math:** Entropy (measuring uncertainty), information gain, Gini impurity

**What You'll Build:**
- Build a Decision Tree and visualize the splits
- Train Random Forest and XGBoost on a real dataset
- Tune hyperparameters and analyze feature importance

---

# Week 6: Unsupervised Learning

- Finding patterns without labels
- K-Means clustering: grouping similar data points
- Hierarchical clustering and DBSCAN (overview)
- PCA (Principal Component Analysis -- finding the most important patterns)
- **Math:** Covariance matrix, eigenvalues/eigenvectors, distance metrics (Euclidean, cosine)

**What You'll Build:**
- Cluster customer data using K-Means with elbow method
- Apply PCA to high-dimensional data and visualize in 2D/3D

---

# Week 7: Midterm Exam

- Covers Weeks 1-6
- ML fundamentals and supervised learning
- Regression and classification
- Model evaluation and tree-based models
- Unsupervised learning
- All associated mathematics

---

# Week 8: Data Preprocessing & Feature Engineering

*If your model fails in the real world, you probably have a data quality problem.*

- Handling missing data: imputation strategies (mean, median, KNN)
- Categorical encoding (turning categories into numbers): one-hot, label, target encoding
- Feature scaling (similar ranges so no feature dominates): normalization vs standardization
- Dealing with imbalanced data: SMOTE, undersampling

**What You'll Build:**
- Build a complete preprocessing pipeline with scikit-learn
- Handle a deliberately messy dataset and measure improvement

---

# Week 9: End-to-End ML Project

- The complete ML lifecycle: business question to deployed model
- Experiment tracking with MLflow: log parameters, metrics, artifacts
- Reproducibility: random seeds, environment management, data versioning
- Model selection: comparing multiple approaches systematically
- Business impact measurement: translating metrics to business value

**What You'll Build:**
- Solve a real-world problem from raw data to final prediction
- Create a model comparison report with statistical analysis

---

# Week 10: Introduction to Neural Networks

*Neural networks are behind image recognition, language translation, and AI assistants.*

- From linear models to neural networks: why we need non-linearity
- The perceptron and multi-layer perceptron (MLP)
- Activation functions: ReLU, sigmoid, tanh, softmax
- Introduction to PyTorch: tensors, autograd, basic model building
- **Math:** Matrix multiplication for the forward pass, weight matrices

**What You'll Build:**
- Build a simple neural network with PyTorch
- Train on MNIST (handwritten digits) -- the "hello world" of deep learning

---

# Week 11: Training Neural Networks

- Backpropagation (sending error signals backwards through the network)
- Optimizers: SGD, momentum, Adam -- different strategies for optimization
- Regularization: L1/L2, dropout (randomly turning off neurons), batch normalization
- Training diagnostics: monitoring loss curves, detecting problems
- **Math:** Chain rule for gradient flow, optimization landscape (local minima, saddle points)

**What You'll Build:**
- Train an image classifier on CIFAR-10 with PyTorch
- Experiment with different optimizers and learning rates
- Monitor training with TensorBoard

---

# Week 12: From RNN to Transformers

- Why sequence matters: text, time series, audio are sequential data
- RNN (networks with "memory") and the vanishing gradient problem
- LSTM (gates that decide what to remember and forget)
- The attention mechanism: letting the model focus on relevant parts
- Transformer architecture: encoder-decoder, multi-head attention
- **Math:** Attention as matrix ops (Query, Key, Value), scaled dot-product

**What You'll Build:**
- Visualize how attention works step by step
- Explore pre-trained models on Hugging Face

---

# Week 13: ML in Production, Responsible AI & Explainability

*Building a great model is only half the job.*

- Model serving: REST API with FastAPI
- Monitoring in production: model drift detection
- Responsible AI: bias detection, fairness metrics (demographic parity, equalized odds)
- Explainable AI: SHAP (game theory-based feature attribution), LIME (local approximations)
- AI regulation overview: EU AI Act, emerging global standards

**What You'll Build:**
- Deploy a model as a REST API with FastAPI
- Generate SHAP explanations and audit a model for bias

---

# Week 14: Capstone Demo

- Students present their end-to-end ML project
- **Requirements:**
  - Problem definition, data analysis
  - Model development and evaluation
  - Deployment plan
- Peer review and instructor feedback
- Portfolio-ready documentation

---

# Week 15: Reinforcement Learning Fundamentals

*RL is how ChatGPT was trained to be helpful. Build an AI that learns to play a game.*

- A different paradigm: RL learns from experience, not examples
- The RL framework: agent, environment, state, action, reward
- Exploration vs exploitation: epsilon-greedy, UCB, Thompson Sampling
- Q-Learning: learning the best action through trial and error
- Policy gradient: REINFORCE algorithm
- **Math:** Bellman equation, Markov Decision Process, policy gradient theorem

**What You'll Build:**
- Train agents on CartPole and FrozenLake with Q-learning
- Implement a Multi-Armed Bandit with epsilon-greedy, UCB, and Thompson Sampling

---

# Week 16: RL for AI Alignment & Course Capstone

*This is how ChatGPT went from "predicts the next word" to "actually helpful assistant."*

- PPO (Proximal Policy Optimization): the main algorithm behind RLHF
- RLHF: SFT, reward model (Bradley-Terry), PPO optimization with KL penalty
- DPO (Direct Preference Optimization): simpler alternative, no reward model needed
- GRPO (Group Relative Policy Optimization): how DeepSeek R1 was trained
- Constitutional AI: self-improvement through principles

**What You'll Build:**
- Implement a simplified preference learning pipeline
- Course capstone: end-to-end ML project presentation

---

# Recommended Resources

- **Hands-On Machine Learning** -- Aurelien Geron
- **Pattern Recognition and Machine Learning** -- Christopher Bishop
- **The Hundred-Page Machine Learning Book** -- Andriy Burkov
- **Deep Learning** -- Ian Goodfellow, Yoshua Bengio, Aaron Courville
- **Reinforcement Learning: An Introduction** -- Sutton & Barto
