#!/bin/bash

# qTest Integration Local Setup and Test Script
# This script demonstrates how to set up and test the qTest integration locally

echo "🚀 qTest Integration Local Setup"
echo "================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ to proceed."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if required files exist
echo ""
echo "📁 Checking required files..."
required_files=(
    "ExportQtestTCDetails.js"
    "FetchExecutionStatus.js" 
    "compareSuitesToQtest.js"
    "updateExecutionStatusAndComments.js"
    "Properties.json"
    "package.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        exit 1
    fi
done

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "❌ package.json not found"
    exit 1
fi

# Check environment variables
echo ""
echo "🔧 Checking environment configuration..."
if [ -z "$QTEST_TOKEN" ] || [ -z "$QTEST_PROJECT_ID" ] || [ -z "$QTEST_PARENT_ID" ]; then
    echo "⚠️  Environment variables not set. To run qTest integration, set:"
    echo "   export QTEST_TOKEN='Bearer your-token'"
    echo "   export QTEST_PROJECT_ID='your-project-id'"
    echo "   export QTEST_PARENT_ID='your-parent-id'"
    echo ""
    echo "🔗 To get your Bearer token:"
    echo "   1. Login to qTest"
    echo "   2. Click Resource button (↓)"
    echo "   3. Copy the Bearer token"
    echo ""
    echo "📋 For now, using demo configuration..."
else
    echo "✅ Environment variables configured"
    
    # Update Properties.json with environment variables
    cat > Properties.json << EOF
{
    "GET_URL": "https://wawa.qtestnet.com/api/v3/projects/$QTEST_PROJECT_ID/test-runs?parentId=$QTEST_PARENT_ID&parentType=test-suite",
    "PUT_URL": "https://wawa.qtestnet.com/api/v3/projects/$QTEST_PROJECT_ID/test-runs/",
    "POST_URL": "https://wawa.qtestnet.com/api/v3/projects/$QTEST_PROJECT_ID/test-runs/",
    "token": "$QTEST_TOKEN",
    "Content-Type": "application/json"
}
EOF
    echo "✅ Properties.json updated with environment variables"
fi

# Validate JavaScript syntax
echo ""
echo "🔍 Validating JavaScript files..."
for file in *.js; do
    if [ -f "$file" ]; then
        if node -c "$file" 2>/dev/null; then
            echo "✅ $file - syntax OK"
        else
            echo "❌ $file - syntax error"
            node -c "$file"
            exit 1
        fi
    fi
done

# Validate JSON files  
echo ""
echo "🔍 Validating JSON files..."
for file in *.json; do
    if [ -f "$file" ]; then
        if python3 -m json.tool "$file" > /dev/null 2>&1; then
            echo "✅ $file - valid JSON"
        else
            echo "❌ $file - invalid JSON"
            exit 1
        fi
    fi
done

# Check GitHub Actions
echo ""
echo "🎬 Checking GitHub Actions..."
if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions directory found: .github/workflows/"
    echo "📋 Available workflows:"
    ls -1 .github/workflows/*.yml | while read workflow; do
        echo "   • $(basename "$workflow")"
    done
else
    echo "❌ GitHub Actions directory not found"
    exit 1
fi

echo ""
echo "🎉 Setup validation completed successfully!"
echo ""
echo "📖 Next steps:"
echo "   1. Set up qTest environment variables (if not already done)"
echo "   2. Push to GitHub to trigger workflows"
echo "   3. Check Actions tab in GitHub repository"
echo "   4. Monitor qTest integration in workflow logs"
echo ""
echo "🔗 For detailed instructions, see: .github/workflows/README.md"