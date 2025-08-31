const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Professional icon generation script
// This creates app icons from a source SVG or high-res PNG

const ICON_SIZES = {
  'icon.png': 1024,
  'adaptive-icon.png': 1024,
  'favicon.png': 32,
  'splash-icon.png': 512
};

const SOURCE_ICON = path.join(__dirname, '..', 'assets', 'source-icon.png');
const ASSETS_DIR = path.join(__dirname, '..', 'assets');

async function generateIcons() {
  try {
    // Check if source icon exists
    if (!fs.existsSync(SOURCE_ICON)) {
      console.log('Creating placeholder professional icon...');
      
      // Create a professional looking icon with fruit theme
      const svg = `
        <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="fruit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#FF9800;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F57C00;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Background -->
          <rect width="1024" height="1024" rx="180" fill="url(#bg)"/>
          
          <!-- Fruit Icon -->
          <circle cx="512" cy="400" r="150" fill="url(#fruit)"/>
          <ellipse cx="512" cy="280" rx="30" ry="80" fill="#4CAF50"/>
          
          <!-- App Text -->
          <text x="512" y="650" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="white">FruitPlan</text>
          <text x="512" y="720" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="#E8F5E8">AI</text>
        </svg>
      `;
      
      await sharp(Buffer.from(svg))
        .png()
        .toFile(SOURCE_ICON);
    }

    // Generate all required icon sizes
    for (const [filename, size] of Object.entries(ICON_SIZES)) {
      const outputPath = path.join(ASSETS_DIR, filename);
      
      await sharp(SOURCE_ICON)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${filename} (${size}x${size})`);
    }

    console.log('🎨 All icons generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('📝 Please manually create your icons or install sharp: npm install sharp');
  }
}

if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
