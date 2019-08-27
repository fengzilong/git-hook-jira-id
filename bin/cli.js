#!/usr/bin/env node

const path = require( 'path' )
const branch = require( 'git-branch' )
const inquirer = require( 'inquirer' )
const cli = require( 'cac' )()
const fs = require( './fs' )
const pkg = require( '../package.json' )

cli.option( '-p, --prefix <prefix>', 'jira prefix' )
cli.option( '-i, --interactive', 'interactive' )
cli.help()
cli.version( pkg.version )
cli.parse()

const prefix = cli.options.prefix || 'jira'
const interactive = cli.options.interactive

if ( interactive ) {
  inquirer.prompt( [
    {
      type: 'confirm',
      name: 'prependJiraId',
      message: 'prepend jira id for commit message',
      default: true,
    }
  ] ).then( answers => {
    if ( answers.prependJiraId ) {
      commit()
    } else {
      console.log( 'Skipped prepend jira id' )
    }
  } )
} else {
  commit()
}

function commit() {
  const file = path.join( process.cwd(), '.git/COMMIT_EDITMSG' )
  const source = fs.read( file )

  const branchName = branch.sync()

  const matches = branchName.match( new RegExp( prefix + '-\\d+', 'i' ) )

  if ( matches ) {
    const jiraId = matches[ 0 ]
    fs.write( file, jiraId + ': ' + source )
  }
}
