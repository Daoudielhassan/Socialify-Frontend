#!/usr/bin/env node

/**
 * Performance Validation Script
 * Validates that all optimizations are working correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PerformanceValidator {
  constructor() {
    this.distPath = path.join(__dirname, 'dist', 'assets');
    this.results = {
      bundleSize: {},
      chunking: {},
      optimization: {}
    };
  }

  validateBundleSize() {
    console.log('🔍 Validating bundle sizes...');
    
    if (!fs.existsSync(this.distPath)) {
      console.error('❌ Build directory not found. Run npm run build first.');
      return false;
    }

    const files = fs.readdirSync(this.distPath);
    let initialBundle = 0;
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(this.distPath, file);
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      
      totalSize += sizeKB;
      
      if (file.startsWith('index-') && file.endsWith('.js')) {
        initialBundle += sizeKB;
      }

      this.results.bundleSize[file] = sizeKB;
    });

    console.log(`📦 Initial bundle size: ${initialBundle}KB`);
    console.log(`📦 Total bundle size: ${totalSize}KB`);

    // Validation criteria
    const isInitialBundleOptimal = initialBundle < 50; // <50KB target
    const hasSeparateVendorChunks = files.some(f => f.includes('vendor'));
    const hasPageChunks = files.some(f => f.includes('Login-') || f.includes('Dashboard-'));

    console.log(`✅ Initial bundle optimal: ${isInitialBundleOptimal ? 'PASS' : 'FAIL'} (${initialBundle}KB)`);
    console.log(`✅ Vendor chunking: ${hasSeparateVendorChunks ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Page chunking: ${hasPageChunks ? 'PASS' : 'FAIL'}`);

    return isInitialBundleOptimal && hasSeparateVendorChunks && hasPageChunks;
  }

  validateCodeSplitting() {
    console.log('\n🔍 Validating code splitting...');
    
    const files = fs.readdirSync(this.distPath);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    
    const expectedChunks = [
      'react-vendor',
      'router-vendor', 
      'auth-vendor',
      'icons-vendor',
      'Login-',
      'Dashboard-',
      'Analytics-'
    ];

    const foundChunks = expectedChunks.filter(chunk => 
      jsFiles.some(file => file.includes(chunk))
    );

    console.log(`📊 Found ${foundChunks.length}/${expectedChunks.length} expected chunks`);
    foundChunks.forEach(chunk => console.log(`  ✅ ${chunk}`));
    
    const missingChunks = expectedChunks.filter(chunk => !foundChunks.includes(chunk));
    missingChunks.forEach(chunk => console.log(`  ❌ Missing: ${chunk}`));

    return foundChunks.length >= expectedChunks.length * 0.8; // 80% success rate
  }

  validateOptimization() {
    console.log('\n🔍 Validating build optimizations...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    
    // Check for optimization configurations
    const hasMinification = viteConfig.includes('terser');
    const hasBundleAnalysis = packageJson.scripts && packageJson.scripts.analyze;
    const hasManualChunks = viteConfig.includes('manualChunks');
    
    console.log(`✅ Terser minification: ${hasMinification ? 'ENABLED' : 'MISSING'}`);
    console.log(`✅ Bundle analysis: ${hasBundleAnalysis ? 'AVAILABLE' : 'MISSING'}`);
    console.log(`✅ Manual chunking: ${hasManualChunks ? 'CONFIGURED' : 'MISSING'}`);

    return hasMinification && hasManualChunks;
  }

  generateReport() {
    console.log('\n📊 PERFORMANCE VALIDATION REPORT');
    console.log('=====================================');
    
    const bundleValid = this.validateBundleSize();
    const splittingValid = this.validateCodeSplitting();
    const optimizationValid = this.validateOptimization();
    
    const overallScore = [bundleValid, splittingValid, optimizationValid]
      .filter(Boolean).length;
    
    console.log(`\n🎯 Overall Score: ${overallScore}/3`);
    
    if (overallScore === 3) {
      console.log('🎉 EXCELLENT! All optimizations are working correctly.');
      console.log('✅ Ready for production deployment.');
    } else if (overallScore === 2) {
      console.log('⚠️  GOOD! Most optimizations working, minor issues detected.');
    } else {
      console.log('❌ NEEDS WORK! Several optimization issues detected.');
    }

    // Detailed recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (!bundleValid) {
      console.log('- Reduce initial bundle size (<50KB target)');
      console.log('- Implement more aggressive code splitting');
    }
    if (!splittingValid) {
      console.log('- Ensure all major routes are lazy-loaded');
      console.log('- Verify vendor chunking configuration');
    }
    if (!optimizationValid) {
      console.log('- Enable Terser minification in production');
      console.log('- Configure manual chunk splitting');
    }

    return overallScore >= 2;
  }
}

// Run validation
const validator = new PerformanceValidator();
const success = validator.generateReport();

process.exit(success ? 0 : 1);
