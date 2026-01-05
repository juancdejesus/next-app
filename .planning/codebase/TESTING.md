# Testing Patterns

**Analysis Date:** 2026-01-04

## Test Framework

**Current Status: No testing infrastructure configured**

**Frontend:**
- No test framework installed (no Jest, Vitest, or similar in dependencies)
- No test files exist (no `*.test.*`, `*.spec.*`, or `__tests__/` directories)
- ESLint 9 installed but no testing-related plugins

**Backend:**
- No test project (no `api.Tests/` or similar directory)
- No test framework (no xUnit, NUnit, or MSTest references)
- No mocking libraries (no Moq, NSubstitute)

## Test File Organization

**Location:**
- Not applicable - No test files exist

**Naming:**
- Not applicable - No test naming conventions established

**Structure:**
- Not applicable - No test directory structure

## Test Structure

**Suite Organization:**
- Not applicable - No test suites exist

**Patterns:**
- Not applicable - No testing patterns established

## Mocking

**Framework:**
- Not applicable - No mocking framework configured

**Patterns:**
- Not applicable - No mocking patterns established

## Fixtures and Factories

**Test Data:**
- Not applicable - No test data patterns established

**Location:**
- Not applicable - No fixture directory structure

## Coverage

**Requirements:**
- Not established - No coverage targets set

**Configuration:**
- Not configured - No coverage tools installed

**View Coverage:**
- Not applicable - No coverage reporting setup

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

## Common Patterns

**Async Testing:**
- Not applicable - No async testing patterns established

**Error Testing:**
- Not applicable - No error testing patterns established

**Snapshot Testing:**
- Not applicable - No snapshot testing configured

---

## Recommended Testing Strategy

### Frontend Testing Setup

**Recommended Framework:** Vitest
- Fast, Vite-native testing (compatible with Next.js 16)
- Excellent TypeScript support
- Great for component testing with React Testing Library
- Easy migration from Jest if needed

**Recommended Test Organization:**
```
client/src/
├── components/
│   ├── __tests__/
│   │   ├── AppLayout.test.tsx
│   │   └── ThemeToggle.test.tsx
│   ├── AppLayout.tsx
│   └── ThemeToggle.tsx
├── services/
│   ├── __tests__/
│   │   ├── userService.test.ts
│   │   └── employeeService.test.ts
│   ├── userService.ts
│   └── employeeService.ts
├── hooks/
│   ├── __tests__/
│   │   └── useUsers.test.ts
│   └── useUsers.ts
├── utils/
│   ├── __tests__/
│   │   └── userUtils.test.ts
│   └── userUtils.ts
└── context/
    ├── __tests__/
    │   ├── ThemeContext.test.tsx
    │   └── UserContext.test.tsx
    ├── ThemeContext.tsx
    └── UserContext.tsx
```

**Testing Levels:**
1. **Unit Tests**: Services, utilities, helper functions
   - `client/src/services/__tests__/userService.test.ts`
   - `client/src/utils/__tests__/userUtils.test.ts`
2. **Component Tests**: React components using React Testing Library
   - `client/src/components/__tests__/AppLayout.test.tsx`
   - `client/src/app/users/__tests__/UserForm.test.tsx`
3. **Hook Tests**: Custom hooks with @testing-library/react-hooks
   - `client/src/hooks/__tests__/useUsers.test.ts`
4. **Integration Tests**: Feature flows end-to-end
   - `client/src/app/users/__tests__/users-flow.integration.test.tsx`

**Recommended Dependencies:**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "jsdom": "^23.0.0"
  }
}
```

**Recommended vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Backend Testing Setup

**Recommended Framework:** xUnit
- Modern, attribute-based testing
- Better async support than NUnit/MSTest
- Good integration with CI/CD
- Standard for .NET Core projects

**Recommended Test Organization:**
```
api/
├── api.csproj
├── Endpoints/
├── Models/
├── Utils/
└── api.Tests/                    # New test project
    ├── api.Tests.csproj
    ├── Endpoints/
    │   ├── UserEndpointsTests.cs
    │   ├── EmployeeEndpointsTests.cs
    │   └── UserRoleEndpointsTests.cs
    ├── Utils/
    │   └── DapperContextTests.cs
    └── Fixtures/
        └── DatabaseFixture.cs    # Test database setup
```

**Testing Levels:**
1. **Unit Tests**: Utilities, helpers, business logic
   - `api.Tests/Utils/DapperContextTests.cs`
2. **Integration Tests**: Endpoints with database (using test fixtures)
   - `api.Tests/Endpoints/UserEndpointsTests.cs`
3. **API Tests**: Full endpoint testing with Dapper
   - Use WebApplicationFactory<Program> for in-memory testing

**Recommended Dependencies:**
```xml
<ItemGroup>
  <PackageReference Include="xunit" Version="2.6.0" />
  <PackageReference Include="xunit.runner.visualstudio" Version="2.5.0" />
  <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
  <PackageReference Include="Moq" Version="4.20.0" />
  <PackageReference Include="FluentAssertions" Version="6.12.0" />
  <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.0.0" />
</ItemGroup>
```

## Code Quality Tools

### Current Status
- **ESLint**: Installed (v9) but no `.eslintrc` config file found
- **Prettier**: Not installed
- **TypeScript**: `strict: true` mode enabled
- **Code Analysis**: None configured

### Recommended ESLint Configuration

**Create `.eslintrc.json`:**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-types": "warn"
  }
}
```

### Recommended Prettier Configuration

**Create `.prettierrc`:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

## CI/CD Integration

### Current Status
- No GitHub Actions workflows found
- No pre-commit hooks configured
- No test automation visible
- No CI/CD pipeline detected

### Recommended Setup

**Pre-commit Hooks (.husky):**
```bash
# Install Husky
npx husky-init && npm install

# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test
```

**GitHub Actions (.github/workflows/test.yml):**
```yaml
name: Test

on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet restore
      - run: dotnet build --no-restore
      - run: dotnet test --no-build
```

## Code Coverage Targets

### Recommended Minimums
- **Services**: 80%+ coverage (critical business logic)
- **Utilities**: 90%+ coverage (pure functions, easy to test)
- **Components**: 70%+ coverage (UI elements harder to test)
- **Custom Hooks**: 85%+ coverage (state management logic)
- **Endpoints**: 80%+ coverage (API contract validation)
- **Overall**: 75%+ coverage (codebase-wide target)

### Coverage Enforcement
- Block PRs with coverage below 75%
- Require tests for all new code
- Use coverage reports in code review

## Testing Best Practices

**Recommended Patterns:**
1. **File Co-location**: Place `*.test.ts` in `__tests__/` directory adjacent to source
2. **Naming Convention**: Match source name with `.test` suffix
3. **Isolated Tests**: Each test independent, no shared state
4. **Clear Descriptions**: Use `describe()` and `it()` with readable names
5. **AAA Pattern**: Arrange, Act, Assert structure

**Example Test Structure (Frontend):**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserForm } from '../UserForm';

describe('UserForm', () => {
  describe('form submission', () => {
    it('should call onSubmit with form values when valid', async () => {
      // Arrange
      const onSubmit = vi.fn();
      render(<UserForm onSubmit={onSubmit} />);

      // Act
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
      fireEvent.click(screen.getByText('Submit'));

      // Assert
      expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
    });

    it('should show error message when submission fails', async () => {
      // Arrange
      const onSubmit = vi.fn().mockRejectedValue(new Error('API Error'));
      render(<UserForm onSubmit={onSubmit} />);

      // Act
      fireEvent.click(screen.getByText('Submit'));

      // Assert
      await screen.findByText(/error/i);
    });
  });
});
```

**Example Test Structure (Backend):**
```csharp
using Xunit;
using FluentAssertions;
using Moq;

public class UserEndpointsTests
{
    [Fact]
    public async Task GetUsers_ReturnsAllUsers()
    {
        // Arrange
        var mockContext = new Mock<IDapperContext>();
        var expectedUsers = new List<User> { /* ... */ };
        mockContext.Setup(x => x.CreateConnection()).Returns(/* ... */);

        // Act
        var result = await UserEndpoints.GetUsers(mockContext.Object);

        // Assert
        result.Should().BeEquivalentTo(expectedUsers);
    }

    [Fact]
    public async Task CreateUser_ReturnsBadRequest_WhenDataInvalid()
    {
        // Arrange
        var mockContext = new Mock<IDapperContext>();
        var invalidUser = new User { /* invalid data */ };

        // Act
        var result = await UserEndpoints.CreateUser(mockContext.Object, invalidUser);

        // Assert
        result.Should().BeOfType<BadRequestResult>();
    }
}
```

## Known Testing Gaps

**Critical Gaps:**
1. No testing infrastructure exists
2. No test files in codebase
3. No code coverage measurement
4. No CI/CD test automation
5. No pre-commit hooks for quality gates

**Priority Actions:**
1. Set up Vitest for frontend testing
2. Create xUnit test project for backend
3. Add testing scripts to package.json (`test`, `test:watch`, `test:coverage`)
4. Configure ESLint and Prettier
5. Set up pre-commit hooks with Husky
6. Add GitHub Actions for CI/CD
7. Establish coverage targets (75%+ overall)
8. Write tests for critical paths first (user management, authentication)

---

*Testing analysis: 2026-01-04*
*Update when test patterns change*
