import app from './app';
import { dataSource } from './data-source';

import { PORT } from './config';

async function main() {
  try {
    await dataSource.initialize();

    app.listen(PORT, () => {
      console.log('app is listening on port', PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
