import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sourceDir = path.join('src', 'assets', 'images_originais');
const destDir = path.join('public', 'images', 'premios');

const webpOptions = { quality: 80, effort: 6 };

async function optimizeImages() {
    try {
        console.log('Iniciando a otimização de imagens...');
        await fs.mkdir(destDir, { recursive: true });

        const files = await fs.readdir(sourceDir);

        const imagePromises = files
            .filter((file) => /\.(jpe?g|png)$/i.test(file))
            .map(async (file) => {
                const inputFile = path.join(sourceDir, file);
                const baseName = path.basename(file, path.extname(file));

                const outputFile = path.join(destDir, `${baseName}.webp`);

                console.log(`- Processando: ${file}`);

                await Promise.all([
                    sharp(inputFile).webp(webpOptions).toFile(outputFile),
                ]);
            });

        await Promise.all(imagePromises);

        console.log('Otimização concluída com sucesso!');
    } catch (error) {
        console.error('Erro durante a otimização de imagens:', error);
    }
}

optimizeImages();
