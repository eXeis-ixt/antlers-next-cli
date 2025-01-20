#!/usr/bin/env node
import { select, confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

const projectPackages = {
  auth: {
    name: 'Authentication',
    dependencies: ['next-auth'],
    devDependencies: []
  },
  orm: {
    name: 'Database ORM',
    dependencies: ['@prisma/client'],
    devDependencies: ['prisma']
  },
  styling: {
    name: 'Styling Solution',
    dependencies: ['tailwindcss', 'postcss', 'autoprefixer'],
    devDependencies: []
  },
  state: {
    name: 'State Management',
    dependencies: ['@tanstack/react-query'],
    devDependencies: []
  }
};

// List of default shadcn components to install
const defaultComponents = [
  'button',
];

function ensureProjectDirectory(projectPath) {
  const currentDir = process.cwd();
  if (currentDir !== projectPath) {
    process.chdir(projectPath);
    console.log(chalk.gray(`Changed directory to: ${projectPath}`));
  }
}

async function initializeShadcn(spinner, projectPath) {
  try {
    // Ensure we're in the project directory
    ensureProjectDirectory(projectPath);

    // Initialize shadcn
    spinner.text = 'Initializing shadcn/ui...';
    execSync('npx shadcn@latest init', { stdio: 'inherit' });

    // Install default components
    spinner.text = 'Installing shadcn components...';
    for (const component of defaultComponents) {
      execSync(`npx shadcn@latest add ${component}`, { stdio: 'inherit' });
    }
  } catch (error) {
    spinner.fail('Failed to initialize shadcn/ui');
    throw error;
  }
}

async function createProject() {
  console.log(chalk.bold.blue(`
     █████╗ ███╗   ██╗████████╗██╗     ███████╗██████╗ ███████╗
    ██╔══██╗████╗  ██║╚══██╔══╝██║     ██╔════╝██╔══██╗██╔════╝
    ███████║██╔██╗ ██║   ██║   ██║     █████╗  ██████╔╝███████╗
    ██╔══██║██║╚██╗██║   ██║   ██║     ██╔══╝  ██╔══██╗╚════██║
    ██║  ██║██║ ╚████║   ██║   ███████╗███████╗██║  ██║███████║
    ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
    ██╗      █████╗ ██████╗ ███████╗
    ██║     ██╔══██╗██╔══██╗██╔════╝
    ██║     ███████║██████╔╝███████╗
    ██║     ██╔══██║██╔══██╗╚════██║
    ███████╗██║  ██║██████╔╝███████║
    ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝
  `));

  try {
    // Get project name
    const projectName = await input({
      message: 'What is your project named?',
      default: 'my-antlers-app'
    });

    // Validate project name
    if (!projectName.match(/^[a-zA-Z0-9-_]+$/)) {
      throw new Error('Project name can only contain letters, numbers, dashes and underscores');
    }

    // Select packages
    const selectedPackages = [];
    for (const [key, value] of Object.entries(projectPackages)) {
      const shouldInclude = await confirm({
        message: `Would you like to use ${value.name}?`,
        default: true
      });
      if (shouldInclude) {
        selectedPackages.push(key);
      }
    }

    // Create project directory
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
      throw new Error(`Directory ${projectName} already exists!`);
    }

    const spinner = ora('Creating your Antlers project...').start();

    try {
      // Create Next.js project
      spinner.text = 'Creating Next.js project...';
      execSync(`npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`, {
        stdio: 'inherit'
      });

      // Initialize shadcn/ui
      await initializeShadcn(spinner, projectPath);

      // Install additional packages
      if (selectedPackages.length > 0) {
        spinner.text = 'Installing additional packages...';
        
        for (const packageKey of selectedPackages) {
          const { dependencies, devDependencies } = projectPackages[packageKey];
          
          if (dependencies && dependencies.length > 0) {
            execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
          }
          
          if (devDependencies && devDependencies.length > 0) {
            execSync(`npm install -D ${devDependencies.join(' ')}`, { stdio: 'inherit' });
          }
        }
      }

      // Initialize Prisma if selected
      if (selectedPackages.includes('orm')) {
        spinner.text = 'Initializing Prisma...';
        execSync('npx prisma init', { stdio: 'inherit' });
      }

      spinner.succeed(chalk.green('✨ Project created successfully!'));

      // Show next steps
      console.log('\n' + chalk.bold('Next steps:'));
      console.log(chalk.blue(`1. cd ${projectName}`));
      console.log(chalk.blue('2. npm run dev'));

      if (selectedPackages.includes('orm')) {
        console.log('\n' + chalk.yellow.bold('Additional setup needed:'));
        console.log(chalk.yellow('1. Update DATABASE_URL in .env'));
        console.log(chalk.yellow('2. Run npx prisma db push'));
      }

      console.log('\n' + chalk.green.bold('Included by default:'));
      console.log(chalk.green('• shadcn/ui - A beautiful component library'));
      console.log(chalk.green(`• Pre-installed components: ${defaultComponents.join(', ')}`));

    } catch (error) {
      spinner.fail(chalk.red('Failed to create project'));
      throw error;
    }

  } catch (error) {
    console.error('\n' + chalk.red('Error: ') + error.message);
    process.exit(1);
  }
}

createProject().catch((error) => {
  console.error('\n' + chalk.red('Fatal error: ') + error.message);
  process.exit(1);
});