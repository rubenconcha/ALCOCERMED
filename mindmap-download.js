'use strict';
(() => {
    const brand = 'PREPA BEN CARSON';

    async function render(image, scale, format) {
        const canvas = document.createElement('canvas');
        const width = Math.floor(image.naturalWidth * scale);
        const height = Math.floor(image.naturalHeight * scale);
        const fontSize = Math.max(12, Math.round(width * 0.018));
        const footerHeight = Math.ceil(fontSize * 2);
        canvas.width = width;
        canvas.height = height + footerHeight;

        try {
            const context = canvas.getContext('2d');
            if (!context) throw new Error('No pudimos preparar la imagen.');
            context.drawImage(image, 0, 0, width, height);
            context.fillStyle = '#f5f8fb';
            context.fillRect(0, height, width, footerHeight);
            context.fillStyle = '#d6e1ec';
            context.fillRect(0, height, width, Math.max(1, Math.round(width / 1600)));
            context.font = '700 ' + fontSize + 'px Arial, sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = '#416183';
            context.fillText(brand, width / 2, height + footerHeight / 2, width * 0.9);
            return await new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob?.size) resolve(blob);
                    else reject(new Error('No pudimos guardar la imagen.'));
                }, format, 1);
            });
        } finally {
            canvas.width = canvas.height = 1;
        }
    }

    async function save(source, filename, isCurrent = () => true) {
        if (!source || !isCurrent()) return;
        const image = new Image();
        const objectUrl = typeof source === 'string' ? '' : URL.createObjectURL(source);
        image.crossOrigin = 'anonymous';
        image.src = objectUrl || source;
        try {
            await image.decode();
            if (!isCurrent()) return;
            const format = /\.png$/i.test(filename) ? 'image/png' : 'image/webp';
            let blob;
            try {
                blob = await render(image, 1, format);
            } catch (error) {
                const pixels = image.naturalWidth * (image.naturalHeight + image.naturalWidth * 0.04);
                if (!isCurrent() || pixels <= 15_000_000) throw error;
                blob = await render(image, Math.sqrt(15_000_000 / pixels), format);
            }
            if (!isCurrent()) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename.replace(/\.[^.]+$/, blob.type === 'image/webp' ? '.webp' : '.png');
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
    }

    window.MindmapDownload = { save };
})();
