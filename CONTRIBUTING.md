# Contributing to OIDC Mock Provider

Thank you for considering contributing to the OIDC Mock Provider!

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/) format for commit messages to automate versioning and changelog generation.

### Format

Each commit message consists of:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

The `type` must be one of:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```
feat(frontend): add dark mode toggle
fix(backend): fix OIDC token validation
docs: update README with Docker instructions
```

## Pull Request Process

1. Ensure your code follows the project's coding style
2. Update documentation if needed
3. Make sure all tests pass
4. Use descriptive commit messages following the conventional commits format
