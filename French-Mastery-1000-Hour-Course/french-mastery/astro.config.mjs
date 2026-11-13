import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  site: 'https://atelier-francais-mille-heures.unison-softw-0672.chatgpt.site',
  integrations: [starlight({
    title: 'Atelier français',
    description: 'A thousand hours. A language for life. Beginning to C1 French.',
    customCss: ['./src/styles/custom.css'],
    components: { Head: './src/components/Head.astro', PageTitle:'./src/components/PageTitle.astro' },
    sidebar: [
      { label: 'Start here', items: [{ label: 'Your 1,000-hour journey', slug: 'journey' }, {label: 'How to study', slug: 'study'}] },
      { label: 'The textbook', items: [{ autogenerate: {directory: 'course'} }] },
      { label: 'Practice studio', items: [{label: 'All practice modes', slug: 'practice'}, {label: 'Vocabulary explorer', slug: 'vocabulary'}, {label: 'Speaking & pronunciation', slug: 'speaking'}, {label: 'Progress & review', slug: 'progress'}] },
      { label: 'Reference', items: [{label: 'Grammar map', slug:'grammar-map'}, {label:'Grammar desk reference',slug:'grammar-reference'}, {label:'Sources & browser support',slug:'sources'}] }
    ],
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
  })]
});
