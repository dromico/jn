const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Source and destination directories
const sourceDir = path.join(__dirname, '../public/img');
const outputDir = path.join(__dirname, '../public/optimized-img');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Image sizes for responsive images
const sizes = [320, 640, 1024, 1920];

// Quality settings
const jpegQuality = 80;
const webpQuality = 75;
const avifQuality = 65;

// Process each image in the source directory
async function processImages() {
  try {
    // Get all files in the source directory
    const files = fs.readdirSync(sourceDir);

    console.log(`Found ${files.length} images to process`);

    // Process each file
    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      const fileExt = path.extname(file).toLowerCase();
      const fileName = path.basename(file, fileExt);

      // Skip non-image files
      if (!['.jpg', '.jpeg', '.png'].includes(fileExt)) {
        console.log(`Skipping non-image file: ${file}`);
        continue;
      }

      // Skip logo.jpg as specified in requirements
      if (fileName === 'logo' && ['.jpg', '.jpeg'].includes(fileExt)) {
        console.log(`Skipping logo file: ${file} (reserved for branding elements)`);

        // Just copy the logo file to the output directory without optimization
        const outputPath = path.join(outputDir, file);
        fs.copyFileSync(filePath, outputPath);
        console.log(`Copied logo file to: ${outputPath}`);
        continue;
      }

      console.log(`Processing image: ${file}`);

      // Load the image
      const image = sharp(filePath);

      // Get image metadata
      const metadata = await image.metadata();

      // Generate responsive sizes
      for (const size of sizes) {
        // Skip sizes larger than the original image
        if (size > metadata.width) continue;

        // Resize image
        const resized = image.clone().resize(size);

        // Generate JPEG version
        await resized
          .jpeg({ quality: jpegQuality, mozjpeg: true })
          .toFile(path.join(outputDir, `${fileName}-${size}.jpg`));

        // Generate WebP version
        await resized
          .webp({ quality: webpQuality })
          .toFile(path.join(outputDir, `${fileName}-${size}.webp`));

        // Generate AVIF version
        await resized
          .avif({ quality: avifQuality })
          .toFile(path.join(outputDir, `${fileName}-${size}.avif`));
      }

      // Generate a tiny placeholder for blur-up effect
      await image
        .resize(20)
        .blur(5)
        .jpeg({ quality: 30 })
        .toFile(path.join(outputDir, `${fileName}-placeholder.jpg`));

      console.log(`Finished processing: ${file}`);
    }

    console.log('Image optimization complete!');
    console.log(`Optimized images saved to: ${outputDir}`);

  } catch (error) {
    console.error('Error processing images:', error);
  }
}

// Run the image processing
processImages();