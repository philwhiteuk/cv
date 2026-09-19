FROM ruby:3.2.3

# Install Node.js for Tailwind CSS
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

VOLUME /usr/src
WORKDIR /usr/src

# Install Ruby gems
RUN gem install jekyll bundler
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Install npm dependencies for Tailwind
COPY package.json tailwind.config.js ./
RUN npm install

ENTRYPOINT ["bundle","exec","jekyll"]
