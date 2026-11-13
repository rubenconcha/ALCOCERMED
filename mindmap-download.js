'use strict';
(() => {
    const brand = 'PREPA BEN CARSON';
    const logoUrl = '/assets/mindmaps/encefalo/logo.webp';
    let logoRequest;

    function loadLogo() {
        if (!logoRequest) {
            const logo = new Image();
            logo.src = logoUrl;
            logoRequest = logo.decode().then(() => logo).catch(error => {
                logoRequest = null;
                throw error;
            });
        }
        return logoRequest;
    }

    async function render(image, logo, scale, format) {
        const canvas = document.createElement('canvas');
        const width = Math.floor(image.naturalWidth * scale);
        const height = Math.floor(image.naturalHeight * scale);
        const fontSize = Math.max(12, Math.round(width * 0.018));
        const footerHeight = fontSize * 3;
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
            const logoHeight = Math.round(fontSize * 2.1);
            // Keep the transparent margins out of the layout while preserving the logo's proportions.
            const crop = { x: 58, y: 88, width: 390, height: 272 };
            const logoWidth = Math.round(logoHeight * crop.width / crop.height);
            const gap = Math.round(fontSize * 0.6);
            const textWidth = Math.min(context.measureText(brand).width, width - logoWidth - gap);
            const left = (width - logoWidth - gap - textWidth) / 2;
            const middle = height + footerHeight / 2;
            context.drawImage(logo, crop.x, crop.y, crop.width, crop.height, left, middle - logoHeight / 2, logoWidth, logoHeight);
            context.textAlign = 'left';
            context.textBaseline = 'middle';
            context.fillStyle = '#416183';
            context.fillText(brand, left + logoWidth + gap, middle, textWidth);
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
            const [, logo] = await Promise.all([image.decode(), loadLogo()]);
            if (!isCurrent()) return;
            const format = /\.png$/i.test(filename) ? 'image/png' : 'image/webp';
            let blob;
            try {
                blob = await render(image, logo, 1, format);
            } catch (error) {
                const pixels = image.naturalWidth * (image.naturalHeight + image.naturalWidth * 0.055);
                if (!isCurrent() || pixels <= 15_000_000) throw error;
                blob = await render(image, logo, Math.sqrt(15_000_000 / pixels), format);
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
