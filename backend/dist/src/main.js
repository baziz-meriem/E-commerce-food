"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const envPath = (0, path_1.join)(process.cwd(), '.env');
if ((0, fs_1.existsSync)(envPath)) {
    (0, dotenv_1.config)({ path: envPath });
}
else {
    const nested = (0, path_1.join)(process.cwd(), 'backend', '.env');
    if ((0, fs_1.existsSync)(nested))
        (0, dotenv_1.config)({ path: nested });
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    app.enableCors({
        origin: (origin, cb) => {
            if (!origin) {
                cb(null, true);
                return;
            }
            if (corsOrigins.includes(origin)) {
                cb(null, origin);
                return;
            }
            try {
                const host = new URL(origin).hostname;
                if (host.endsWith('.vercel.app') ||
                    host.endsWith('.onrender.com') ||
                    host === 'localhost') {
                    cb(null, origin);
                    return;
                }
            }
            catch {
                cb(new Error('CORS'), false);
                return;
            }
            cb(new Error('CORS'), false);
        },
        credentials: true,
    });
    const port = Number(process.env.PORT) || 4000;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map