# Codestyle

- early returns over continue
- early returns instead of else
- static values via object or array and key instead of conditions where possible
- opening and closing brackets are mandatory
- refer to www.codacy.com and www.codeclimate.com as well

# Commits

- take your existing branch or open a new one
- commit with "Fixes #[ticket]" so the commits are automatically listed in the ticket
- test the changes yourself and fix any bugs you might encounter in your branch
- check your branch with www.codacy.com and/or www.codeclimate.com if it introduces more issues than it solves
- create a pull-request and (if possible) let someone have a look
- when accepting the pull-request all related tickets are closed

# Testing

The test version of a branch is avabile at https::/dotd.idrinth.de/static/userscript/[branch] and is uncached.
Pushes to your branch are usually deployed to it automatically within secods.

# Server-Side changes

Serverside code is not publicly accessible, so changes can only be implemented by  Idrinth. Please label your tickets accordingly, so they are easy to find.
