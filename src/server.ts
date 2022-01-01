import { app } from './app';

app.listen(process.env.PORT || 4000, () =>
  console.log(`🚀 The [${process.env.NODE_ENV}] server is running!`),
);
