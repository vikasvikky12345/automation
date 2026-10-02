# Custom CodeBuild image for the Android pipeline: JDK 21 (Capacitor 8), Node 22, Android SDK.
# Build for x86_64 (CodeBuild); Android's aapt2 has no linux/arm64 build.
#   docker build --platform linux/amd64 -f ci/android-builder.Dockerfile -t automate-android-builder ci
FROM public.ecr.aws/docker/library/node:22-bookworm-slim AS node

FROM public.ecr.aws/docker/library/eclipse-temurin:21-jdk-noble

RUN apt-get update \
 && apt-get install -y --no-install-recommends unzip git curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Node 22 + npm 11 (npm 10.9.x crashes on install, see package.json packageManager).
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
 && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
 && npm install -g npm@11.21.0

# Android SDK. Versions match android/variables.gradle (compileSdk 36) and AGP 8.13 (build-tools 35).
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
ARG CMDLINE_TOOLS=commandlinetools-linux-13114758_latest.zip
RUN mkdir -p $ANDROID_HOME/cmdline-tools \
 && curl -fsSL https://dl.google.com/android/repository/$CMDLINE_TOOLS -o /tmp/tools.zip \
 && unzip -q /tmp/tools.zip -d $ANDROID_HOME/cmdline-tools \
 && mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest \
 && rm /tmp/tools.zip \
 && yes | sdkmanager --licenses > /dev/null \
 && sdkmanager --install "platform-tools" "platforms;android-36" "build-tools;35.0.0" > /dev/null

# Pre-install the Gradle distribution the wrapper would download on every build
# (keep in sync with android/gradle/wrapper/gradle-wrapper.properties).
# The wrapper looks for it under dists/<name>/<base36 md5 of distributionUrl>/, plus a .ok marker.
ARG GRADLE_VERSION=8.14.3
RUN URL=https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-all.zip \
 && HASH=$(node -e "const c=require('crypto');console.log(BigInt('0x'+c.createHash('md5').update(process.argv[1]).digest('hex')).toString(36))" "$URL") \
 && DIR=/root/.gradle/wrapper/dists/gradle-${GRADLE_VERSION}-all/$HASH \
 && mkdir -p $DIR \
 && curl -fsSL "$URL" -o $DIR/gradle-${GRADLE_VERSION}-all.zip \
 && unzip -q $DIR/gradle-${GRADLE_VERSION}-all.zip -d $DIR \
 && touch $DIR/gradle-${GRADLE_VERSION}-all.zip.ok

RUN java -version && node -v && npm -v && sdkmanager --list_installed
