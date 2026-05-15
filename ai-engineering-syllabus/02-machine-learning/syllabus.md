# Machine Learning

**Understand the theory, master the math, build the models**

---

## Course Overview

This course provides a comprehensive foundation in machine learning, combining mathematical theory with hands-on practice. Students will learn how ML algorithms work under the hood, implement them using industry-standard tools, and deploy models into production. The course emphasizes contextual mathematics — every mathematical concept is introduced at the exact moment it becomes relevant, so students immediately see why it matters.

This course serves as the prerequisite for **Generative AI Engineering** (Semester 2).

---

## Prerequisites

- Programming fundamentals (Python preferred)
- Basic mathematics (algebra, introductory statistics)

## Tools & Technologies

Python, NumPy, Pandas, Matplotlib, scikit-learn, PyTorch, FastAPI, Git, MLflow, OpenAI Gymnasium

---

## Weekly Schedule

---

### Week 1: What is Machine Learning?

**Topics:**
- AI vs ML vs Deep Learning — what's the difference and why it matters
- Types of ML problems: classification, regression, clustering, generation
- The ML workflow: problem definition → data collection → feature engineering → training → evaluation → deployment
- Problem framing: how to identify whether ML is the right solution for a business problem
- When NOT to use ML — recognizing problems better solved with traditional programming
- Introduction to Python development environment and tooling

**Mathematics:**
- Linear algebra introduction: vectors, matrices, dot product
- Hands-on matrix operations with NumPy

**What You'll Build:**
- Map out a complete ML pipeline for a real-world problem
- Set up Python environment with Jupyter, NumPy, Pandas
- Git basics for ML projects: version control, branching, collaboration

---

### Week 2: Supervised Learning — Regression

**Topics:**
- What is supervised learning? Learning from labeled data
- Linear regression: fitting a line to data, the concept of "best fit"
- How machines learn: the training process, loss minimization
- Single variable vs multiple variable regression
- Feature scaling and its impact on regression

**Mathematics:**
- Calculus: slope, derivatives, partial derivatives — what they mean intuitively
- Optimization: cost function (Mean Squared Error), gradient descent algorithm
- Learning rate: too high vs too low, convergence
- Closed-form solution (Normal Equation) vs iterative optimization

**What You'll Build:**
- Implement linear regression from scratch in NumPy to understand gradient descent
- Predict house prices using scikit-learn
- Visualize the learning process: cost function decreasing over iterations

---

### Week 3: Supervised Learning — Classification

**Topics:**
- From regression to classification: predicting categories instead of numbers
- Logistic regression: how a regression model becomes a classifier
- Decision boundaries: linear and non-linear
- Multi-class classification: one-vs-rest, softmax
- Confusion matrix: true positives, false positives, true negatives, false negatives

**Mathematics:**
- Probability: conditional probability, Bayes' theorem — how prior knowledge affects predictions
- The sigmoid (logistic) function: squashing outputs into probabilities
- Log-loss / cross-entropy: why we use this instead of MSE for classification
- Maximum likelihood estimation (intuitive)

**What You'll Build:**
- Build a spam classifier from scratch
- Visualize decision boundaries for different datasets
- Analyze classification results with confusion matrix and classification report

---

### Week 4: Model Evaluation

**Topics:**
- The fundamental challenge: overfitting vs underfitting
- Training set, validation set, test set — why we split data
- Cross-validation: k-fold, stratified k-fold
- Evaluation metrics: accuracy, precision, recall, F1-score, AUC-ROC
- When accuracy is misleading: imbalanced datasets
- Hyperparameter tuning: grid search, random search

**Mathematics:**
- Statistics: mean, variance, standard deviation — measuring spread and central tendency
- Probability distributions: normal distribution, why it matters in ML
- Sampling: stratified sampling, why random isn't always fair
- Bias-variance tradeoff: the mathematical explanation of overfitting

**What You'll Build:**
- Compare multiple models on the same dataset with proper validation
- Build an evaluation pipeline that selects the best model automatically
- Analyze learning curves to diagnose overfitting/underfitting

---

### Week 5: Tree-Based Models

**Topics:**
- Decision trees: how they split data to make decisions
- Random Forest: the power of combining many weak learners (bagging)
- Gradient Boosting: learning from mistakes sequentially (boosting)
- XGBoost: the industry workhorse for tabular data
- Hyperparameter tuning for tree-based models
- Feature importance: which features matter most

**Mathematics:**
- Information theory: entropy — measuring uncertainty/disorder in data
- Information gain: how much a split reduces uncertainty
- Gini impurity: an alternative measure for split quality
- Bootstrapping: sampling with replacement (the foundation of Random Forest)

**What You'll Build:**
- Build a Decision Tree and visualize the splits
- Train a Random Forest and XGBoost model on a real dataset
- Tune hyperparameters using cross-validation
- Analyze and visualize feature importance

---

### Week 6: Unsupervised Learning

**Topics:**
- What is unsupervised learning? Finding patterns without labels
- K-Means clustering: grouping similar data points
- Hierarchical clustering and DBSCAN (overview)
- Dimensionality reduction: why and when to reduce features
- PCA (Principal Component Analysis): projecting data to lower dimensions
- Practical applications: customer segmentation, anomaly detection

**Mathematics:**
- Linear algebra: covariance matrix — how features relate to each other
- Eigenvalues and eigenvectors (intuitive explanation): the "directions" of maximum variance
- Distance metrics: Euclidean, Manhattan, cosine similarity — measuring how "close" data points are
- Variance explained: how much information PCA retains

**What You'll Build:**
- Cluster customer data using K-Means, determine optimal k with elbow method
- Apply PCA to high-dimensional data and visualize in 2D/3D
- Combine clustering + PCA for customer segmentation

---

### Week 7: Midterm Exam

Covers Weeks 1-6: ML fundamentals, supervised learning (regression & classification), model evaluation, tree-based models, unsupervised learning, and all associated mathematics.

---

### Week 8: Data Preprocessing & Feature Engineering

**Topics:**
- The reality of data: real-world data is messy, incomplete, and inconsistent
- Handling missing data: imputation strategies (mean, median, KNN, iterative)
- Categorical encoding: one-hot, label, ordinal, target encoding
- Feature scaling: normalization (min-max) vs standardization (z-score) — when to use which
- Feature selection: filter methods, wrapper methods, embedded methods
- Dealing with imbalanced data: oversampling (SMOTE), undersampling
- Data privacy awareness: GDPR basics, PII handling, anonymization

**Mathematics:**
- Statistics: correlation — measuring linear relationships between features
- Normalization: min-max scaling formula and its properties
- Standardization: z-score formula, why it centers data at 0 with unit variance
- Outlier detection: IQR method, z-score method

**What You'll Build:**
- Build a complete preprocessing pipeline with scikit-learn Pipeline
- Handle a deliberately messy dataset: missing values, mixed types, outliers
- Compare model performance before and after feature engineering

---

### Week 9: End-to-End ML Project

**Topics:**
- The complete ML lifecycle: from business question to deployed model
- Experiment tracking: why it matters, how to use MLflow
- Reproducibility: random seeds, environment management, data versioning
- Model selection strategy: comparing multiple approaches systematically
- Business impact measurement: translating model metrics to business value
- Documenting your work: model cards, data sheets

**Mathematics:**
- Applied: all previous mathematical concepts used in context
- Statistical significance: is this model actually better, or is it just noise?
- Confidence intervals for model performance

**What You'll Build:**
- Solve a real-world problem from raw data to final prediction
- Use MLflow for experiment tracking: log parameters, metrics, artifacts
- Create a model comparison report with statistical analysis
- Present findings with business impact framing

---

### Week 10: Introduction to Neural Networks

**Topics:**
- From linear models to neural networks: why we need non-linearity
- The perceptron: the simplest neural network
- Multi-layer perceptron (MLP): hidden layers, depth, width
- Activation functions: ReLU, sigmoid, tanh, softmax — what each does and when to use it
- The forward pass: how data flows through the network
- Introduction to PyTorch: tensors, autograd, basic model building

**Mathematics:**
- Linear algebra: matrix multiplication for the forward pass — each layer is a matrix operation
- Weight matrices: what they represent, how they transform data
- The concept of learned representations: each layer learns different abstractions
- Softmax: converting raw scores to probabilities

**What You'll Build:**
- Build a simple neural network with PyTorch
- Visualize how different activation functions transform data
- Train a model on MNIST (handwritten digits) — the "hello world" of deep learning

---

### Week 11: Training Neural Networks

**Topics:**
- Backpropagation: how neural networks learn from mistakes
- Optimizers: SGD, momentum, Adam — different strategies for finding the minimum
- Learning rate scheduling: starting fast, then slowing down
- Regularization: preventing overfitting in neural networks
  - L1/L2 regularization (weight decay)
  - Dropout: randomly turning off neurons during training
  - Batch normalization
- Training diagnostics: monitoring loss curves, detecting problems

**Mathematics:**
- Calculus: the chain rule — how gradients flow backwards through the network
- Gradient descent variants: batch, mini-batch, stochastic
- Optimization landscape: local minima, saddle points, loss surfaces
- L1 penalty (sparsity) vs L2 penalty (small weights): mathematical formulation

**What You'll Build:**
- Train an image classifier on CIFAR-10 with PyTorch
- Experiment with different optimizers and learning rates
- Implement dropout and observe its effect on overfitting
- Monitor training with TensorBoard

---

### Week 12: From RNN to Transformers

**Topics:**
- Why sequence matters: text, time series, audio are sequential data
- Recurrent Neural Networks (RNN): processing one token at a time
- The vanishing gradient problem: why basic RNNs struggle with long sequences
- LSTM (Long Short-Term Memory): gates that control information flow (overview)
- The attention mechanism: the breakthrough that changed everything
- Self-attention: how Transformers process all tokens simultaneously
- The Transformer architecture: encoder-decoder, multi-head attention
- How this leads to modern LLMs: GPT, BERT, and beyond
- This is the bridge to Generative AI Engineering (Semester 2)

**Mathematics:**
- Linear algebra: attention as matrix operations — Query, Key, Value matrices
- Scaled dot-product attention: why we divide by square root of dimension
- Softmax in attention: creating a probability distribution over tokens
- Temperature scaling: controlling the "sharpness" of attention

**What You'll Build:**
- Understand how attention works through step-by-step visualization
- Explore pre-trained models on Hugging Face
- See how a Transformer processes text differently from an RNN

---

### Week 13: ML in Production, Responsible AI & Explainability

**Topics:**
- Model serving: packaging a model as a REST API with FastAPI
- Model serialization: saving and loading models (pickle, ONNX, TorchScript)
- Monitoring in production: model drift detection, performance degradation
- A/B testing models: comparing old vs new model in production
- Responsible AI:
  - Bias in data and models: how it happens, how to detect it
  - Fairness metrics: demographic parity, equalized odds
  - AI regulation overview: EU AI Act, emerging global standards
- Explainable AI (XAI):
  - Why explainability matters: trust, regulation, debugging
  - SHAP (SHapley Additive exPlanations): game theory-based feature attribution
  - LIME (Local Interpretable Model-agnostic Explanations): local approximations
  - Model interpretability vs accuracy tradeoff
  - Building trust in ML decisions

**Mathematics:**
- Statistics: A/B testing — hypothesis testing, p-values, statistical significance
- Model drift detection: statistical tests for distribution shift
- Shapley values: the mathematical foundation behind SHAP

**What You'll Build:**
- Deploy a trained model as a REST API with FastAPI
- Set up basic monitoring for prediction drift
- Generate SHAP explanations and visualize feature contributions
- Audit a model for potential bias

---

### Week 14: Capstone Demo

**Format:**
- Students present their end-to-end ML project to the class
- Requirements: problem definition, data analysis, model development, evaluation, deployment plan
- Peer review and instructor feedback
- Portfolio-ready documentation

---

### Week 15: Reinforcement Learning — Machines That Learn by Doing

**Topics:**
- A different paradigm: supervised learning learns from examples, RL learns from experience
- The RL framework: agent, environment, state, action, reward
  - Markov Decision Process (MDP): the mathematical formulation of RL
  - Episodes, trajectories, and the goal of maximizing cumulative reward
- Key concepts:
  - Exploration vs exploitation: try something new or stick with what works?
  - Discount factor (γ): how much to value future rewards vs immediate ones
  - Policy (π): the agent's strategy — mapping states to actions
  - Value function V(s) and action-value function Q(s,a): how good is this state/action?
  - On-policy vs off-policy learning: learning from your own experience vs learning from others
- Multi-Armed Bandit (MAB) — the simplest RL problem:
  - The problem: you have N slot machines, each with unknown payout — which do you pull?
  - Epsilon-greedy strategy: explore randomly ε% of the time, exploit the best option otherwise
  - Upper Confidence Bound (UCB): balance exploration with confidence intervals
  - Thompson Sampling: Bayesian approach to exploration
  - Real-world applications: A/B testing, ad placement, content recommendation, clinical trials
  - Why start here: MAB builds intuition for exploration-exploitation before full MDP
- Value-based methods:
  - Q-Learning: learning the optimal action-value function through trial and error
  - SARSA: on-policy alternative to Q-Learning
  - Deep Q-Network (DQN): using neural networks to approximate Q-values (Atari breakthrough, DeepMind 2015)
  - Experience replay: why storing and replaying past experiences improves stability
  - Target networks: preventing moving-target instability in DQN
- Policy-based methods:
  - Why value-based methods struggle with continuous action spaces
  - REINFORCE algorithm: Monte Carlo policy gradient
  - The high variance problem: why vanilla policy gradient is unstable
  - Baseline subtraction: reducing variance while keeping the estimate unbiased
- Actor-Critic methods — combining both worlds:
  - Actor: the policy network that decides actions
  - Critic: the value network that evaluates how good the actions are
  - Advantage function A(s,a): how much better is this action than average?
  - A2C (Advantage Actor-Critic): synchronous training
  - PPO (Proximal Policy Optimization): the workhorse algorithm of modern RL
    - The clipping mechanism: preventing too-large policy updates
    - Why PPO became the default: stable, simple, effective
    - PPO is used in RLHF for LLM alignment — understanding PPO here is essential for Semester 3
- RL in the real world:
  - Game playing: AlphaGo (Monte Carlo Tree Search + RL), Atari (DQN), Dota 2 (PPO), StarCraft II
  - Robotics: learning to walk, grasp objects, sim-to-real transfer
  - Recommendation systems: optimizing long-term user engagement, not just click-through rate
  - Resource optimization: data center cooling (Google DeepMind saved 40% energy), traffic control
  - Finance: portfolio optimization, order execution
- RL for LLMs — the bridge to Generative AI:
  - RLHF (Reinforcement Learning from Human Feedback): how ChatGPT was aligned
    - Step 1: supervised fine-tuning (SFT) — teach the model to follow instructions
    - Step 2: train a reward model from human preference rankings (Bradley-Terry model)
    - Step 3: optimize the policy (LLM) using PPO against the reward model
    - The KL penalty: preventing the model from drifting too far from the SFT baseline
  - DPO (Direct Preference Optimization): simpler alternative to RLHF
    - Key insight: you can implicitly optimize the reward without training a separate reward model
    - The DPO loss function: directly training on preference pairs (chosen vs rejected)
    - Trade-offs vs RLHF: simpler but potentially less flexible
  - GRPO (Group Relative Policy Optimization): how DeepSeek R1 was trained
    - The innovation: using group scores instead of a learned reward model
    - Sample multiple outputs, rank them, use relative ranking as reward signal
    - Why it matters: enables training reasoning capabilities without human-labeled preferences
  - RLVR (Reinforcement Learning from Verifiable Rewards): training reasoning models
    - How o1, o3, and DeepSeek R1 learn to "think"
    - Verifiable rewards: math problems have correct answers, code has test cases
    - The emergence of chain-of-thought through RL: the model learns to reason because reasoning gets rewarded
  - Constitutional AI (CAI): Anthropic's approach
    - Self-critique: the model evaluates its own outputs against principles
    - RLAIF (RL from AI Feedback): using AI instead of humans to provide feedback
  - Why this matters: RL is the key technique that turns a base LLM into a helpful, harmless, and honest assistant
- Limitations of RL: sample inefficiency, reward hacking, sim-to-real gap, safety concerns, reward misspecification

**Mathematics:**
- Probability: Markov property — the future depends only on the present, not the past
- Expected value: the Bellman equation — recursive definition of optimal value
  - V*(s) = max_a [R(s,a) + γ · Σ P(s'|s,a) · V*(s')]
  - Q*(s,a) = R(s,a) + γ · Σ P(s'|s,a) · max_a' Q*(s',a')
- Optimization: policy gradient theorem — how to compute gradients for policy improvement
  - ∇J(θ) = E[∇log π(a|s;θ) · A(s,a)] — the core equation behind REINFORCE, A2C, and PPO
- Discount factor: geometric series for cumulative rewards
- KL divergence: measuring how much the updated policy deviates from the original (used in PPO and RLHF)
- Bradley-Terry model: converting human preference rankings into a reward signal

**What You'll Build:**
- Implement a Multi-Armed Bandit with epsilon-greedy, UCB, and Thompson Sampling — visualize regret curves
- Train a Q-Learning agent to solve a grid world (visualize Q-values evolving over episodes)
- Implement DQN to play a simple Atari game using OpenAI Gymnasium
- Experiment with reward shaping: see how different reward functions change agent behavior
- Walk through a simplified RLHF pipeline: generate preference data → train reward model → optimize with PPO
- Compare DPO vs RLHF on a small language model: see how both methods align model outputs

---

### Week 16: Final Exam

Comprehensive exam covering all course material: ML concepts, algorithms, mathematics, evaluation, neural networks, production deployment, responsible AI, and explainability.

---

## Learning Outcomes

By the end of this course, students will be able to:

1. Understand the mathematical foundations behind ML algorithms
2. Implement core algorithms and explain why they work, not just how to call them
3. Choose the right model and evaluation strategy for a given problem
4. Build end-to-end ML pipelines from raw data to trained model
5. Work with both classical ML and neural networks using industry-standard tools
6. Deploy models into a production-ready API with monitoring
7. Apply responsible AI principles including bias detection, fairness, and explainability (SHAP, LIME)
8. Understand reinforcement learning from fundamentals to LLM alignment: Multi-Armed Bandits, Q-Learning, DQN, PPO, and how RL powers modern AI alignment (RLHF, DPO, GRPO, Constitutional AI)
9. Use professional workflows: Git, experiment tracking, and collaborative development
10. Frame business problems as ML tasks and measure real-world impact

---

## Mathematics Distribution Summary

| Math Area | Progression | Weeks |
|---|---|---|
| Linear Algebra | Vectors, matrices, dot product → covariance, eigen → attention matrices | 1, 6, 10, 12 |
| Calculus | Derivatives → partial derivatives → chain rule (backpropagation) | 2, 11 |
| Probability & Statistics | Bayes' theorem → distributions → correlation → A/B testing → Markov, Bellman | 3, 4, 5, 8, 13, 15 |
| Optimization | Gradient descent → SGD, Adam → regularization → policy gradient | 2, 11, 15 |
| Information Theory | Entropy, information gain, Gini impurity | 5 |
