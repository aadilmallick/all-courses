import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  site: 'https://hyderabadi-baatcheet-1000.unison-softw-0672.chatgpt.site',
  integrations: [starlight({
    title: 'Ghar ki Baat',
    description: 'Hyderabadi Urdu in Roman script. A 1,000-hour path to family conversation.',
    customCss: ['./src/styles/custom.css'],
    components: { Head: './src/components/Head.astro' },
    sidebar: [
      {label:'Begin your journey',items:[{label:'The 1,000-hour path',slug:'journey'},{label:'How to study',slug:'study'},{label:'Roman sounds & spelling',slug:'roman'}]},
      {label:'The conversation course',items:[{autogenerate:{directory:'course'}}]},
      {label:'Your practice studio',items:[{label:'Quizzes & translation',slug:'practice'},{label:'1,000-word vocabulary',slug:'vocabulary'},{label:'Listening & speaking',slug:'speaking'},{label:'Milestone assessments',slug:'assessments'},{label:'Your learning journal',slug:'progress'}]},
      {label:'Keep nearby',items:[{label:'Grammar reference',slug:'grammar'},{label:'Hyderabadi field guide',slug:'hyderabadi'},{label:'Sources & audio support',slug:'sources'}]}
    ],
    tableOfContents:{minHeadingLevel:2,maxHeadingLevel:3},
    social:[]
  })]
});
