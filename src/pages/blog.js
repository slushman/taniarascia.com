import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../layout'
import PostListing from '../components/PostListing'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'
import kebabCase from 'lodash.kebabcase'
import _ from 'lodash'

class BlogPage extends Component {
  state = {
    searchTerm: '',
    posts: this.props.data.posts.edges,
    filteredPosts: this.props.data.posts.edges,
  }

  handleChange = event => {
    this.setState({ searchTerm: event.target.value })
    this.filterPosts(event.target.value)
  }

  filterPosts = searchTerm => {
    const { posts } = this.state

    const filteredPosts = posts.filter(post =>
      post.node.frontmatter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    this.setState({ filteredPosts })
  }

  render() {
    const { filteredPosts, searchTerm } = this.state
    const filterCount = filteredPosts.length
    const categories = this.props.data.categories.group.filter(
      category => category.fieldValue !== 'Popular'
    )

    return (
      <Layout>
        <Helmet title={`Articles – ${config.siteTitle}`} />
        <SEO />
        <div className="container">
          <h1>Articles</h1>
          <p>
            <strong>Popular guides:</strong>{' '} 
            <a href="/everything-i-know-as-a-software-developer-without-a-degree/">My roadmap</a>,{' '} 
            <a href="/getting-started-with-react">React</a>,{' '} 
            <a href="/how-to-connect-to-an-api-with-javascript/">APIs</a>,{' '} 
            <a href="/how-to-create-and-use-bash-scripts/">Bash</a>,{' '} 
            <a href="/es6-syntax-and-feature-overview/">ES6</a>,{' '} 
            <a href="/how-to-use-the-command-line-for-apple-macos-and-linux/">Command line</a>,{' '} 
            <a href="/overview-of-sql-commands-and-pdo-operations/">SQL</a>,{' '} 
            <a href="/design-for-developers/">Design</a>,{' '} 
            <a href="/create-a-simple-database-app-connecting-to-mysql-with-php/">PHP/MySQL</a>,{' '} 
            <a href="/how-to-use-jquery-a-javascript-library/">jQuery</a>,{' '} 
            <a href="/learn-sass-now/">Sass</a>,{' '} 
            <a href="/what-is-bootstrap-and-how-do-i-use-it/">Bootstrap</a>,{' '} 
            <a href="/developing-a-wordpress-theme-from-scratch/">WordPress</a>,{' '} 
            <a href="/getting-started-with-git/">Git</a>
          </p>
          <div className="flex">
            <input
              className="search"
              type="text"
              name="searchTerm"
              value={searchTerm}
              placeholder="Type here to filter posts..."
              onChange={this.handleChange}
            />
            <div className="filter-count">{filterCount}</div>
          </div>
          <PostListing postEdges={filteredPosts} />
        </div>
      </Layout>
    )
  }
}

export default BlogPage

export const pageQuery = graphql`
  query BlogQuery {
    posts: allMarkdownRemark(limit: 2000, sort: { fields: [fields___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt(pruneLength: 180)
          timeToRead
          frontmatter {
            title
            tags
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
    categories: allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___categories) {
        fieldValue
        totalCount
      }
    }
  }
`
