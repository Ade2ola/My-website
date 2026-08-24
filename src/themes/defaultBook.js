export const defaultBook = {
  metadata: {
    title: 'The Lost Alchemist',
    subtitle: 'A Tale of Shadows and Gold',
    author: 'Aveline Thorne',
    publisher: '',
    isbn: '978-3-16-148410-0',
    language: 'en',
    trimSize: '6" x 9"',
    paperColor: 'cream',
    margins: {
      inside: 0.75,
      outside: 0.5,
      top: 0.75,
      bottom: 0.75
    },
    bleed: 0.125,
    runningHeader: 'The Lost Alchemist',
    runningHeaderAuthor: 'Aveline Thorne',
    showPageNumbers: true,
    pageNumberStyle: 'bottom-center'
  },
  activeThemeId: 'classic-novel',
  chapterDesigner: {
    alignment: 'center',
    numberingStyle: 'word-upper', // 'Chapter One', 'Chapter 1', 'CHAPTER I', 'none'
    dividerStyle: 'ornament',
    firstPageSpacing: '60px',
    dropCaps: true,
    openingParagraphStyle: 'small-caps'
  },
  sections: [
    {
      id: 'title-page',
      type: 'front-matter',
      subType: 'title-page',
      title: 'Title Page',
      content: `
        <div style="text-align: center; margin-top: 100px;">
          <h1 style="font-size: 2.5em; margin-bottom: 10px;">The Lost Alchemist</h1>
          <h3 style="font-size: 1.2em; font-style: italic; color: #555; margin-bottom: 50px;">A Tale of Shadows and Gold</h3>
          <p style="font-size: 1.2em; font-weight: 500; margin-top: 100px;">Aveline Thorne</p>
        </div>
      `
    },
    {
      id: 'copyright-page',
      type: 'front-matter',
      subType: 'copyright-page',
      title: 'Copyright Page',
      content: `
        <div style="font-size: 0.85em; line-height: 1.6; margin-top: 120px;">
          <p><strong>The Lost Alchemist</strong></p>
          <p>Copyright © 2026 by Aveline Thorne</p>
          <p>All rights reserved. No part of this book may be reproduced in any form or by any electronic or mechanical means, including information storage and retrieval systems, without permission in writing from the publisher, except by a reviewer, who may quote brief passages in a review.</p>
          <p style="margin-top: 20px;">This book is a work of fiction. Names, characters, places, and incidents either are products of the author’s imagination or are used fictitiously. Any resemblance to actual persons, living or dead, events, or locales is entirely coincidental.</p>
          <p style="margin-top: 20px;">First Edition: July 2026</p>
          <p style="margin-top: 20px;">ISBN: 978-3-16-148410-0</p>
        </div>
      `
    },
    {
      id: 'dedication',
      type: 'front-matter',
      subType: 'dedication',
      title: 'Dedication',
      content: `
        <div style="text-align: center; margin-top: 180px; font-style: italic; line-height: 1.8;">
          <p>For those who search in the dark corners of libraries,</p>
          <p>hoping to find a door where there was only a wall.</p>
          <p style="margin-top: 30px;">And for my grandfather, who gave me my first notebook.</p>
        </div>
      `
    },
    {
      id: 'chapter-1',
      type: 'chapter',
      subType: 'chapter',
      title: 'The Copper Vial',
      content: `
        <p>It was a cold, foggy night in London when Aveline Thorne first discovered the copper vial. Hidden behind a loose brick in the damp wall of the old cellar, it was sealed with dark, crumbling wax that smelled faintly of pine sap and dried lavender.</p>
        <p>She wiped away the grime of nearly a century. On the metal surface, tiny letters had been etched in a language she did not yet understand, but whose curves and sharp angles matched the Codex she had spent the last three years translating.</p>
        <p>The street above was dead silent, save for the occasional patter of rain against the iron grates. Aveline held the vial close to her lantern. The wax seal was stamped with a symbol she knew all too well—the interlocking rings of the Hermetic Order of the Dawn.</p>
        
        <div class="scene-break" data-type="divider">❦</div>
        
        <p>Hours later, the fire in her study was dying, leaving only amber embers to combat the chill. Outside, carriage wheels rattled over wet cobblestones. Aveline leaned closer to the desk, the copper vial resting on her green blotter.</p>
        <p>She reached for her notebook and began to write. The ink flowed dark and clean across the page, translating the glyphs:</p>
        <ul>
          <li><em>"He who opens this seal shall inherit the weights of the past."</em></li>
          <li><em>"The gold is not in the crucible, but in the fire."</em></li>
          <li><em>"Seek the third key where the shadow of the cathedral falls at noon."</em></li>
        </ul>
        <p>She paused, tapping her quill against her chin. The cathedral. There was only one cathedral in London that matched the drawings in the Codex, and its catacombs had been closed to the public since the Great Plague. She knew what she had to do next.</p>
      `
    },
    {
      id: 'chapter-2',
      type: 'chapter',
      subType: 'chapter',
      title: 'The Whispering Codex',
      content: `
        <p>The library of Saint Jude was a vault of shadows. Dust motes danced in the pale shafts of sunlight that pierced the high arched windows, casting long columns of gray onto the rows of oak shelving.</p>
        <p>Aveline moved silently down the aisle, her fingers brushing the leather spines of books that had not been opened in generations. She stopped at shelf 14. The Whispering Codex was supposed to be here, locked inside a iron-banded chest. But when she reached the end of the aisle, she found only an empty space where the chest should have been.</p>
        <p>A cold dread settled in her stomach. Someone else had found the reference. Or worse, someone had followed her here.</p>
        
        <div class="scene-break" data-type="divider">❦</div>
        
        <p>Behind her, a floorboard creaked. It was a tiny sound, easily mistaken for the settling of the old building, but in the absolute silence of Saint Jude, it sounded like a pistol shot.</p>
        <p>She did not turn around immediately. Instead, she slipped her hand into her coat pocket, feeling the cold, reassuring metal of the copper vial. "Who is there?" she asked, her voice echoing in the rafters.</p>
        <p>A figure stepped out of the shadows. He wore a heavy wool coat, his face obscured by the brim of a dark hat. "You shouldn't have opened the seal, Miss Thorne," he said, in a voice as dry as old parchment.</p>
      `
    },
    {
      id: 'acknowledgements',
      type: 'back-matter',
      subType: 'acknowledgements',
      title: 'Acknowledgements',
      content: `
        <div style="margin-top: 50px;">
          <p style="margin-bottom: 20px;">This book could not have been written without the support and patience of many wonderful people. First and foremost, I must thank my editor, whose sharp eyes and critical questions transformed a messy manuscript into a cohesive story.</p>
          <p style="margin-bottom: 20px;">To the librarians at the British Library and the London Archives, thank you for letting me search through your oldest manuscripts and maps. Your help in finding the historical records of the Hermetic Order was invaluable.</p>
          <p style="margin-bottom: 20px;">Finally, to my friends and family who read early drafts and pretended to be interested in 17th-century alchemy: thank you. This book is as much yours as it is mine.</p>
        </div>
      `
    },
    {
      id: 'about-author',
      type: 'back-matter',
      subType: 'about-author',
      title: 'About the Author',
      content: `
        <div style="margin-top: 50px; text-align: center;">
          <h2 style="font-size: 1.5em; margin-bottom: 20px;">Aveline Thorne</h2>
          <p style="text-align: left; margin-bottom: 20px; line-height: 1.7;">Aveline Thorne is an antiquarian researcher and novelist based in London. She holds a degree in Historical Archaeology and has spent over a decade investigating secret societies and alchemical traditions in Europe. When she is not writing or translating old texts, she can be found exploring ruins or search in old bookshops.</p>
          <p style="text-align: left; line-height: 1.7;"><em>The Lost Alchemist</em> is her debut novel. Follow her research updates at www.avelinethorne.com.</p>
        </div>
      `
    }
  ]
};
