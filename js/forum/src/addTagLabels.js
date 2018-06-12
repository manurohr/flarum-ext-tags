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

    // add primary and secondary tags as slugs to body classnames. 
    extend(DiscussionPage.prototype, 'view', function(vdom) {
    if (this.discussion) {
      const tags = sortTags(this.discussion.tags());

      if (tags && tags.length) {
        let slug_array = [];
        let slug_item;
        tags.forEach(function(item,index,array) {
            slug_item = tags[index].slug();
            slug_array.push(slug_item);
        })
        let slugs_string = slug_array.join(' ');
          // create any unexisting attribute in order to refresh vdom. only in that way,
          // css class can be included to app container.
        vdom.attrs.test = 'test'; 
        vdom.attrs.className += ' ' + slugs_string;
        this.bodyClass += ' ' + slugs_string;
      }
    } else {
      console.log('this.discussion was not defined');
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

  // Add a list of a discussion's tags to the discussion hero, displayed
  // before the title. Put the title on its own line.
  extend(DiscussionHero.prototype, 'items', function(items) {
    const tags = this.props.discussion.tags();

    if (tags && tags.length) {
      items.add('tags', tagsLabel(tags, {link: true}), 5);
    }
  });
}
