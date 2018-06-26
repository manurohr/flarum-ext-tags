import Component from 'flarum/Component';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/helpers/listItems';
import humanTime from 'flarum/helpers/humanTime';
import icon from 'flarum/helpers/icon';

import tagLabel from 'flarum/tags/helpers/tagLabel';
import sortTags from 'flarum/tags/utils/sortTags';

export default class TagsPage extends Component {
  init() {
    this.tags = sortTags(app.store.all('tags').filter(tag => !tag.parent()));

    app.current = this;
    app.history.push('tags', icon('th-large'));
    app.drawer.hide();
    app.modal.close();
  }

  view() {
    const pinned = this.tags.filter(tag => tag.position() !== null);
    const cloud = this.tags.filter(tag => tag.position() === null);

    return (
      <div className="TagsPage">
        {IndexPage.prototype.hero()}
        <div className="container">
          <nav className="TagsPage-nav IndexPage-nav sideNav" config={IndexPage.prototype.affixSidebar}>
            <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
          </nav>

          <div className="TagsPage-content sideNavOffset">
            <ul className="TagTiles">
              {pinned.map(tag => {
                const lastDiscussion = tag.lastDiscussion();
                const children = sortTags(app.store.all('tags').filter(child => child.parent() === tag));
                return (
                  <li className={'TagTile ' + tag.slug() + ' ' +(tag.color() ? 'colored' : '')}
                    style={{backgroundColor: tag.color()}}>
                    <a className="TagTile-info" href={app.route.tag(tag)} config={m.route}>
                      <h3 className="TagTile-name">{tag.name()}</h3>
                      <p className="TagTile-description">{tag.description()}</p>
                    </a>
                      {children.length
                        ? (
                          <div className="TagTile-children">
                          <div>Unterkategorien</div>
                            {children.map(child => [
                              <a href={app.route.tag(child)} config={function(element, isInitialized) {
                                if (isInitialized) return;
                                $(element).on('click', e => e.stopPropagation());
                                m.route.apply(this, arguments);
                              }}>
                                {child.name()}
                              </a>,
                              ' '
                            ])}
                          </div>
                        ) : ''}
                    {lastDiscussion
                      ? (
                        <a className="TagTile-lastDiscussion"
                          href={app.route.discussion(lastDiscussion, lastDiscussion.lastPostNumber())}
                          config={m.route}>
                          <span className="TagTile-lastDiscussion-helper">Letze Diskussion {humanTime(lastDiscussion.lastTime())}</span>
                          <span className="TagTile-lastDiscussion-title">{lastDiscussion.title()}</span>
                        </a>
                      ) : (
                        <span className="TagTile-lastDiscussion">Noch keine Diskussion vorhanden</span>
                      )}
                  </li>
                );
              })}
            </ul>

            {cloud.length ? (
              <div className="TagCloud">
                {cloud.map(tag => {
                  const color = tag.color();

                  return [
                    tagLabel(tag, {link: true}),
                    ' '
                  ];
                })}
              </div>
            ) : ''}
          </div>
          <div className="TagsPage-footer">
            <div className="TagsPage-footer-links">
                <nav>
                  <ul>
                    <li class="copyright">© 2018 Quickline</li>
                    <li><a href="/p/2-community-nutzungsbedingungen" target="_blank" title="nutzungsbedingungen">Community Nutzungsbedingungen</a></li>
                    <li><a href="https://www.quickline.ch/impressum/" target="_blank" title="Impressum">Impressum</a></li>
                    <li><a href="https://www.quickline.ch/rechtliche-hinweise/" target="_blank" title="Rechtliche Hinweise">Rechtliche Hinweise</a></li>
                    <li><a href="http://qlgroup.quickline.ch/mediacenter/pressemitteilungen/" target="_blank" title="Medien">Medien</a></li>
                  </ul>
                </nav>
            </div>
            <div className="TagsPage-footer-social">
              <nav>
                <ul>
                  <li class="">
                    <a class="nav-link" href="https://www.facebook.com/quickline?!%2Fquickline%3Fsk=wall" target="_blank" title="Facebook">
                      <i class="fa fa-facebook fa-lg"></i>
                    </a>
                  </li>
                  <li class="">
                    <a class="nav-link" href="https://plus.google.com/110483154215435496087/posts" target="_blank" title="Google+">
                      <i class="fa fa-google-plus fa-lg"></i>
                    </a>
                  </li>
                  <li class="last">
                    <a class="nav-link" href="http://www.youtube.com/user/QUICKLINEmultimedia" target="_blank" title="Youtube">
                      <i class="fa fa-youtube-play fa-lg"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
