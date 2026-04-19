#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It moves the /app directory to /app-example and creates a new /app directory with an index.tsx file.
 *
 * You can remove the `reset-project` script from package.json and this file when you're done.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const oldDirPath = path.join(root, 'app');
const newDirPath = path.join(root, 'app-example');
const newAppDirPath = path.join(root, 'app');

const indexContent = `import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

fs.renameSync(oldDirPath, newDirPath);
fs.mkdirSync(newAppDirPath, { recursive: true });
fs.writeFileSync(path.join(newAppDirPath, 'index.tsx'), indexContent);

console.log('Project reset complete. App directory has been moved to app-example.');
