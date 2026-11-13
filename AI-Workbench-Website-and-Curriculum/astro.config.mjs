import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  site: 'https://ai-workbench-developer-field-guide.unison-softw-0672.chatgpt.site',
  integrations: [starlight({
    title: 'AI Workbench',
    description: 'A practical field guide to agents, voice, and generative video.',
    favicon: '/favicon.svg',
    customCss: ['./src/styles/custom.css'],
    social: [],
    sidebar: [
      {label:'The field guide',items:[{label:'Overview',slug:''},{label:'Explore all tools',slug:'tools'},{label:'Learning paths',slug:'learning-paths'},{label:'Foundations',slug:'foundations'},{label:'Compare & choose',slug:'compare'}]},
      {label:'01 / Software factories',collapsed:true,items:[{autogenerate:{directory:'factories'}}]},
      {label:'02 / Agent sandboxes',collapsed:true,items:[{autogenerate:{directory:'sandboxes'}}]},
      {label:'03 / Voice agents',collapsed:true,items:[{autogenerate:{directory:'voice'}}]},
      {label:'04 / Video & avatars',collapsed:true,items:[{autogenerate:{directory:'video'}}]},
      {label:'Research desk',items:[{label:'Sources & methodology',slug:'research'},{label:'Emerging tools & changes',slug:'watchlist'},{label:'Cross-tool projects',slug:'projects'}]}
    ],
    tableOfContents:{minHeadingLevel:2,maxHeadingLevel:3},
    head:[{tag:'meta',attrs:{name:'theme-color',content:'#0b1716'}}]
  })]
});


