import { configure, addDecorator } from '@storybook/polymer';
import { setOptions } from '@storybook/addon-options';
import { withKnobs } from '@storybook/addon-knobs';
import '@storybook/addon-console';
import litAny from '../../lit-any/package';

addDecorator(withKnobs);

function loadStories() {
    const req = require.context('..', true, /\.stories\.js$/);
    req.keys().forEach(filename => req(filename));
}

setOptions({
    name: `lit-any ${litAny.version}`,
    addonPanelInRight: true,
    selectedAddonPanel: 'storybooks/storybook-addon-knobs',
    url: 'https://github.com/wikibus/lit-any',
    sortStoriesByKind: true,
});

configure(loadStories, module);
