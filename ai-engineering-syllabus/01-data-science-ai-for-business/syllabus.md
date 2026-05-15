# Data Science & AI for Business

**Transform data into decisions, translate business problems into AI solutions**

---

## Course Overview

This course bridges the gap between raw data and business impact. Students learn to explore, analyze, and visualize data using industry-standard tools, then translate insights into actionable business recommendations. Unlike pure technical courses, this program emphasizes the business context: how to frame problems, measure ROI, communicate findings to stakeholders, and build data products that drive real value. The course also covers AI product management fundamentals — how to evaluate when AI is the right solution and how to manage AI projects from ideation to deployment.

In 2026, with 93% of organizations agreeing that data strategy is crucial for extracting value from AI, this course provides the essential foundation before diving into Machine Learning and Generative AI.

This course serves as the **prerequisite** for Machine Learning (Semester 2).

---

## Prerequisites

- Basic computer literacy
- Willingness to learn Python (no prior programming required)

## Tools & Technologies

Python, Pandas, NumPy, Matplotlib, Seaborn, Plotly, SQL, Jupyter Notebooks, Power BI / Tableau, Streamlit, Git

---

## Weekly Schedule

---

### Week 1: The Data-Driven Organization

**Topics:**
- What is data science? Where it sits between statistics, computer science, and business
- The data science workflow: question → collect → clean → analyze → visualize → communicate → decide
- Types of analytics: descriptive (what happened), diagnostic (why), predictive (what will happen), prescriptive (what should we do)
- Data roles: data analyst vs data scientist vs data engineer vs ML engineer vs AI engineer
- AI-augmented analytics: how GenAI copilots (inside BI tools, notebooks) are changing the analytics workflow in 2026
- The "citizen data scientist" movement: low-code/no-code analytics and AutoML

**What You'll Build:**
- Set up Python environment with Jupyter Notebooks
- Explore a real-world dataset and formulate business questions

---

### Week 2: Python for Data Analysis

**Topics:**
- Python fundamentals for data work: variables, data types, loops, functions, list comprehensions
- NumPy: arrays, vectorized operations, mathematical functions
- Pandas basics: Series, DataFrame, reading data from CSV/Excel/JSON
- Data selection and filtering: loc, iloc, boolean indexing
- Aggregation: groupby, pivot tables, crosstabs
- Working with dates and time series data

**What You'll Build:**
- Analyze a sales dataset: top products, seasonal trends, customer segments
- Build a reusable data loading and cleaning script

---

### Week 3: SQL for Data Science

**Topics:**
- Why SQL matters: the universal language of data
- Core SQL: SELECT, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT
- Joins: INNER, LEFT, RIGHT, FULL — connecting tables
- Subqueries and Common Table Expressions (CTEs)
- Window functions: ROW_NUMBER, RANK, LAG, LEAD, running totals
- Database concepts: relational models, normalization basics, primary/foreign keys
- Connecting Python to databases: SQLAlchemy, pandas read_sql

**What You'll Build:**
- Query a multi-table business database to answer real business questions
- Combine SQL and Python in a single analytics workflow

---

### Week 4: Exploratory Data Analysis (EDA)

**Topics:**
- The art of EDA: letting data tell its story before making assumptions
- Descriptive statistics: central tendency (mean, median, mode), spread (variance, std dev, IQR)
- Distribution analysis: histograms, box plots, violin plots, identifying skewness
- Correlation analysis: Pearson, Spearman, correlation matrices, spurious correlations
- Handling messy data: missing values, duplicates, inconsistent formats
- Outlier detection: z-score, IQR method, visual inspection
- EDA with AI assistants: using GenAI to generate initial exploration code and hypotheses

**What You'll Build:**
- Perform comprehensive EDA on a real-world dataset
- Create an EDA report with findings, hypotheses, and recommended next steps

---

### Week 5: Data Visualization & Storytelling

**Topics:**
- Principles of effective data visualization: clarity, simplicity, honesty
- Chart selection: when to use bar, line, scatter, heatmap, treemap, funnel
- Matplotlib and Seaborn: static, publication-quality charts
- Plotly: interactive, web-ready visualizations
- Dashboard design principles: layout, hierarchy, interactivity, audience awareness
- Introduction to Power BI or Tableau: connecting data, building dashboards, publishing
- Data storytelling: the narrative arc (situation → complication → resolution)
- Avoiding misleading visualizations: scale manipulation, cherry-picking, correlation ≠ causation

**What You'll Build:**
- Create an interactive dashboard for a business case study
- Present a data story with a clear narrative and actionable recommendations

---

### Week 6: Statistics for Business Decisions

**Topics:**
- Probability fundamentals: events, conditional probability, Bayes' theorem (intuitive)
- Probability distributions: normal, binomial, Poisson — when each applies
- Sampling and estimation: sample vs population, confidence intervals
- Hypothesis testing: null vs alternative hypothesis, p-values, significance levels
- A/B testing: how tech companies make data-driven product decisions
- Common statistical mistakes: p-hacking, multiple comparisons, confusing significance with importance
- Practical significance vs statistical significance: the business perspective

**What You'll Build:**
- Design and analyze a simulated A/B test for a product feature
- Make a business recommendation based on statistical evidence

---

### Week 7: Midterm Exam

Covers Weeks 1-6: data science fundamentals, Python, SQL, EDA, visualization, and statistics.

---

### Week 8: Predictive Analytics & Forecasting

**Topics:**
- Introduction to predictive analytics: using historical data to predict future outcomes
- Time series analysis: trends, seasonality, cyclical patterns
- Simple forecasting methods: moving averages, exponential smoothing
- Introduction to regression for prediction: linear regression as a business tool
- Predictive analytics in practice: demand forecasting, churn prediction, lifetime value estimation
- Real-time analytics: why "instant insights" matter in 2026 — streaming data, event-driven analysis
- Tools for real-time: brief overview of streaming concepts (Kafka, event-driven architectures)

**What You'll Build:**
- Build a sales forecasting model using time series techniques
- Create a churn risk scoring system for a subscription business

---

### Week 9: Data Engineering Essentials

**Topics:**
- Where does data come from? Sources: databases, APIs, web scraping, IoT, logs, files
- ETL vs ELT: Extract, Transform, Load — the data pipeline concept
- Data quality: the hidden cost of bad data — detection, measurement, remediation
- Data warehousing concepts: fact tables, dimension tables, star schema
- Cloud data storage: data lakes vs data warehouses vs data lakehouses
- Brief overview of modern data stack: dbt, Airflow, cloud warehouses (BigQuery, Snowflake)
- Data governance basics: who owns the data, data catalogs, lineage tracking
- Data privacy: GDPR, PII handling, anonymization, consent management

**What You'll Build:**
- Build a simple ETL pipeline: extract from API, transform with Python, load into a database
- Document a data dictionary and data quality report

---

### Week 10: AI for Business — When and How to Use AI

**Topics:**
- AI as a business tool: not every problem needs AI, and not every AI project succeeds
- The AI project lifecycle: ideation → feasibility → data assessment → build → deploy → measure → iterate
- Problem framing: translating business problems into data/AI problems
- Build vs buy vs fine-tune: decision framework for AI solutions
- AI product management fundamentals:
  - Writing AI-specific PRDs (Product Requirement Documents)
  - Success metrics for AI products: accuracy, latency, user satisfaction, business KPIs
  - Managing uncertainty: AI is probabilistic, not deterministic
- The 95% failure rate: why most AI investments show zero return (MIT research 2026)
- Case studies: successful and failed AI implementations across industries

**What You'll Build:**
- Evaluate 3 business scenarios and determine if AI is the right solution
- Write an AI project proposal with problem framing, data requirements, success metrics, and ROI estimation

---

### Week 11: Communicating with Stakeholders

**Topics:**
- The analytics translator role: bridging technical teams and executive leadership
- Executive communication: how to present data findings to non-technical stakeholders
- Building compelling business cases: data-backed recommendations with clear ROI
- Report writing: structure (executive summary → methodology → findings → recommendations)
- Presentation skills: designing slides with data, avoiding "death by PowerPoint"
- Handling objections: "but my gut says otherwise" — navigating data vs intuition conflicts
- Ethics of presentation: honest framing, acknowledging uncertainty, avoiding misleading conclusions

**What You'll Build:**
- Create an executive presentation for a data analysis project
- Practice presenting to a simulated C-suite audience with Q&A

---

### Week 12: Building Data Products with Streamlit

**Topics:**
- What is a data product? Applications that serve data-driven insights to end users
- Introduction to Streamlit: turning Python scripts into interactive web applications
- Building interactive dashboards: filters, charts, tables, user inputs
- Connecting to live data: APIs, databases, file uploads
- Deployment basics: sharing your Streamlit app with others
- Product thinking for data scientists: who is the user, what problem does it solve, how do we measure success
- Introduction to AI-powered data products: chat interfaces for data querying (text-to-SQL)

**What You'll Build:**
- Build a complete data product with Streamlit: interactive dashboard with filters, charts, and insights
- Deploy and share it with classmates for feedback

---

### Week 13: AI Ethics & Data Responsibility

**Topics:**
- Bias in data: sampling bias, historical bias, measurement bias, representation bias
- Fairness in data products: who is helped, who is harmed?
- Privacy by design: building data products that protect user privacy from the start
- The regulatory landscape: GDPR, CCPA, Indonesia's PDP Law
- Data ethics frameworks: how to evaluate the ethical implications of data projects
- AI in hiring, lending, healthcare: high-stakes domains where data decisions matter most
- Responsible data communication: transparency, source attribution, acknowledging limitations

**What You'll Build:**
- Audit a dataset for potential biases and document findings
- Write a data ethics assessment for an AI project proposal

---

### Week 14: Capstone Demo

**Format:**
- Students present a complete data science project to the class
- Requirements: business question, data collection, EDA, analysis, visualization, insights, business recommendation
- Bonus: deploy as a Streamlit data product
- Peer review and instructor feedback

---

### Week 15: Review & Catch-up

Buffer week for topics that need reinforcement. Can be used for industry guest lecture, portfolio review, or career preparation.

---

### Week 16: Final Exam

Comprehensive exam covering all course material: data analysis, SQL, statistics, visualization, predictive analytics, data engineering, AI for business, ethics, and communication.

---

## Learning Outcomes

By the end of this course, students will be able to:

1. Analyze and explore datasets using Python (Pandas, NumPy) and SQL
2. Create effective visualizations and interactive dashboards that tell a compelling data story
3. Apply statistical methods (hypothesis testing, A/B testing) to make data-driven business decisions
4. Build predictive analytics models for forecasting and risk scoring
5. Understand data engineering fundamentals: ETL pipelines, data quality, data governance
6. Evaluate when AI is the right solution and write AI project proposals with clear success metrics
7. Communicate data insights effectively to both technical and non-technical stakeholders
8. Build and deploy interactive data products using Streamlit
9. Apply data ethics principles and navigate the privacy/regulatory landscape
10. Frame business problems as data problems and measure real-world impact
