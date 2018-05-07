import { extend } from 'flarum/extend';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import DiscussionPage from 'flarum/components/DiscussionPage';
import DiscussionHero from 'flarum/components/DiscussionHero';

import tagsLabel from 'flarum/tags/helpers/tagsLabel';
import sortTags from 'flarum/tags/utils/sortTags';

export default function() {
  // Add tag labels to each discussion in the discussion list.
  extend(DiscussionListItem.prototype, 'infoItems', function(items) {
    const tags = this.props.discussion.tags();

    if (tags && tags.length) {
      items.add('tags', tagsLabel(tags), 10);
    }
  });

  // Include a discussion's tags when fetching it.
  extend(DiscussionPage.prototype, 'params', function(params) {
    params.include.push('tags');
  });

  // Restyle a discussion's hero to use its first tag's color.
  extend(DiscussionHero.prototype, 'view', function(view) {
    const tags = sortTags(this.props.discussion.tags());

    if (tags && tags.length) {
      const color = tags[0].color();
      if (color) {
        view.attrs.style = {backgroundColor: color};
        view.attrs.className += ' DiscussionHero--colored';
      }
    }
  });

  // add primary and secondary tags as classname on every discussion page
  extend(DiscussionPage.prototype, 'view', function(vdom) {
    if (this.discussion) {
      const tags = sortTags(this.discussion.tags());

      if (tags && tags.length) {
        if (tags.length > 1) {
          const second_slug = tags[1].slug();
          const slug = tags[0].slug();
          // create any unexisting attribute in order to refresh vdom. only in that way,
          // css class can be included to app container.
          vdom.attrs.test = 'test'; 
          vdom.attrs.className += ' ' + slug + ' ' + second_slug;
          this.bodyClass += ' ' + slug + ' ' + second_slug;
        } else {
          const slug = tags[0].slug();

          // create any unexisting attribute in order to refresh vdom. only in that way,
          // css class can be included to app container.
          vdom.attrs.test = 'test'; 
          vdom.attrs.className += ' ' + slug;
          this.bodyClass += ' ' + slug;
        }
      }
    } else {
      console.log('this.discussion was not defined');
    }
  });

  // Add a list of a discussion's tags to the discussion hero, displayed
  // before the title. Put the title on its own line.
  extend(DiscussionHero.prototype, 'items', function(items) {
    const tags = this.props.discussion.tags();

    if (tags && tags.length) {
      items.add('tags', tagsLabel(tags, {link: true}), 5);
    }
  });
}
