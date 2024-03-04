FROM ruby:3.2.3
VOLUME /usr/src
WORKDIR /usr/src
RUN gem install jekyll bundler
COPY Gemfile Gemfile.lock ./
RUN bundle install
ENTRYPOINT ["bundle","exec","jekyll"]
