# GitHub Actions for qTest Integration

This directory contains GitHub Actions workflows that automate various aspects of the qTest integration project.

## 📁 Location

GitHub Actions workflows are located in: **`.github/workflows/`**

## 🔧 Available Workflows

### 1. Test Automation with qTest Integration (`test-automation-qtest.yml`)

**Purpose:** Runs automated tests and integrates results with qTest

**Triggers:**
- Push to main/master branch
- Pull requests to main/master branch  
- Manual trigger with test suite selection
- Scheduled daily runs at 2 AM UTC

**Features:**
- Runs WebDriver.io tests across multiple Node.js versions
- Automatically updates qTest with test results
- Uploads test artifacts and logs
- Provides detailed test execution reports

**Required Secrets:**
- `QTEST_TOKEN` - Your qTest Bearer token
- `QTEST_PROJECT_ID` - Your qTest project ID  
- `QTEST_PARENT_ID` - Your qTest parent test suite ID

### 2. Deploy qTest Integration (`deploy-qtest-integration.yml`)

**Purpose:** Deploys the qTest integration to different environments

**Triggers:**
- Release creation
- Manual deployment with environment selection

**Features:**
- Validates qTest API connectivity
- Packages integration files for deployment
- Creates environment-specific configurations
- Provides deployment artifacts

### 3. Code Quality and Validation (`code-quality.yml`)

**Purpose:** Validates code quality and project structure

**Triggers:**
- Push to main/master/develop branches
- Pull requests to main/master/develop branches

**Features:**
- JavaScript syntax validation
- JSON structure validation
- qTest integration file structure checks
- Basic security scanning
- Generates quality reports

## 🚀 Getting Started

### Step 1: Configure Repository Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `QTEST_TOKEN` | Bearer token from qTest | `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` |
| `QTEST_PROJECT_ID` | qTest project identifier | `107214` |
| `QTEST_PARENT_ID` | Parent test suite ID | `10658816` |

### Step 2: Get Your qTest Bearer Token

1. Login to your qTest application
2. Click on Resource button (↓) 
3. Copy the Bearer token
4. Add it to repository secrets as `QTEST_TOKEN`

### Step 3: Find Your Project and Parent IDs

1. Navigate to your qTest project
2. Check the URL for project ID: `https://yourorg.qtestnet.com/p/{PROJECT_ID}/`
3. Navigate to your test suite and get the parent ID from URL or API

### Step 4: Enable Workflows

Workflows will automatically run based on their triggers. You can also:

1. Go to Actions tab in your repository
2. Select a workflow
3. Click "Run workflow" for manual execution

## 📋 Workflow Status

You can monitor workflow execution in the **Actions** tab of your repository:

- ✅ **Green checkmark** - Workflow completed successfully
- ❌ **Red X** - Workflow failed  
- 🟡 **Yellow circle** - Workflow in progress
- ⏸️ **Gray dash** - Workflow skipped

## 🔍 Viewing Results

### Test Results
- Navigate to Actions → Test Automation workflow
- Click on a run to see detailed logs
- Download test artifacts from the Summary page

### qTest Integration Status
- Check workflow logs for qTest API calls
- Verify test status updates in your qTest project
- Review uploaded test evidence

### Code Quality Reports
- View validation summary in workflow summary
- Check individual file validation status
- Review security scan results

## 🛠️ Customization

### Modifying Test Triggers

Edit `.github/workflows/test-automation-qtest.yml`:

```yaml
on:
  push:
    branches: [ main, develop ]  # Add/remove branches
  schedule:
    - cron: '0 6 * * 1-5'       # Run weekdays at 6 AM
```

### Adding New Environments

Edit `.github/workflows/deploy-qtest-integration.yml`:

```yaml
inputs:
  environment:
    type: choice
    options:
    - staging
    - production
    - qa          # Add new environment
```

### Custom Test Suites

Add custom test suite options in the manual trigger:

```yaml
inputs:
  test_suite:
    type: choice
    options:
    - all
    - smoke
    - regression
    - integration
    - custom-suite  # Add your suite
```

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `401 Unauthorized` | Check qTest Bearer token in secrets |
| `Missing required secrets` | Ensure all secrets are configured |
| `Node.js version issues` | Update Node.js version in workflow |
| `Test files not found` | Check file paths in workflow |

### Debug Mode

Enable debug logging by adding this secret:
- `ACTIONS_STEP_DEBUG` = `true`

### Local Testing

Test qTest integration locally:

```bash
# Set environment variables
export QTEST_TOKEN="Bearer your-token"
export QTEST_PROJECT_ID="your-project-id"
export QTEST_PARENT_ID="your-parent-id"

# Run integration scripts
node ExportQtestTCDetails.js
node FetchExecutionStatus.js
node compareSuitesToQtest.js
```

## 📖 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [qTest API Documentation](https://support.tricentis.com/community/manuals_detail.do?lang=en&version=20.3&module=qTest%20Manager&url=api_docs/index.html)
- [WebDriver.io Documentation](https://webdriver.io/)

## 🤝 Contributing

When adding new workflows:

1. Follow existing naming conventions
2. Add appropriate documentation
3. Test thoroughly before merging
4. Update this README with new workflow details