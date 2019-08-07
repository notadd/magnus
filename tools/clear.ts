import rimraf from 'rimraf';
import { join } from 'path'
async function clear(path: string) {
    rimraf(path, () => {
        console.log(`rimraf`)
    })
}
clear(join(process.cwd(), "libs/**/*.{js,d.ts,js.map}"));
clear(join(process.cwd(), "demo/**/*.{js,d.ts,js.map}"));
clear(join(process.cwd(), "tools/**/*.{js,d.ts,js.map}"));
