# Quickstart Guide

> Get up and running with Courier in minutes. Choose between API-first development or visual design to send your first notification.

Send your first notification in minutes with Courier. Choose your preferred approach:

## Option 1: Send via API (Developers)

Send notifications programmatically using our SDKs and APIs.

### Prerequisites

1. [Sign up](https://app.courier.com/signup) for a Courier account
2. Add an [integration](/external-integrations/integrations-overview) (like SendGrid for email)
3. Get your [API key](https://app.courier.com/settings/api-keys)

## Installation

<CodeGroup>
  ```bash Node.js
  npm install @trycourier/courier
  ```

  ```bash Python
  pip install trycourier
  # or
  poetry add trycourier
  ```

  ```bash Ruby
  # Add to Gemfile
  gem 'trycourier'
  # Then run
  gem install trycourier
  ```

  ```bash PHP
  composer require trycourier/courier
  ```

  ```bash Java
  # Add to pom.xml
  <dependency>
    <groupId>com.courier</groupId>
    <artifactId>courier-java</artifactId>
    <version>X.X.X</version>
    <scope>compile</scope>
  </dependency>

  # Then run
  mvn compile
  ```

  ```bash Go
  go get github.com/trycourier/courier-go/v2
  ```

  ```bash C#
  # Using .NET CLI
  dotnet add package Courier.Client

  # Using NuGet CLI
  nuget install Courier.Client
  ```
</CodeGroup>

## Initialize the SDK

First, import the Courier client and initialize it with your authorization token:

<CodeGroup>
  ```javascript Node.js
  const { CourierClient } = require("@trycourier/courier");
  const courier = new CourierClient({ authorizationToken: "<AUTH_TOKEN>" });
  ```

  ```python Python
  from courier.client import Courier

  client = Courier(authorization_token="<AUTH_TOKEN>")
  ```

  ```ruby Ruby
  require "trycourier"

  client = Courier::Client.new "<AUTH_TOKEN>"
  ```

  ```php PHP
  <?php
  require "./vendor/autoload.php";
  use Courier\CourierClient;

  $courier = new CourierClient("https://api.courier.com/send", "<AUTH_TOKEN>");
  ```

  ```java Java
  import services.Courier;
  import services.SendService;
  import models.SendEnhancedRequestBody;
  import models.SendEnhancedResponseBody;
  import models.SendRequestMessage;
  import com.google.gson.Gson;
  import java.io.IOException;
  import java.util.HashMap;

  Courier.init("<AUTH_TOKEN>");
  ```

  ```go Go
  import (
      "context"
      "log"
      "github.com/trycourier/courier-go/v2"
  )

  client := courier.CreateClient("<AUTH_TOKEN>", nil)
  ```

  ```csharp C#
  using Courier.Client;

  var courier = new Courier("<AUTH_TOKEN>");

  // Optional: Configure client options
  var courier = new Courier("<AUTH_TOKEN>", new ClientOptions {
      TimeoutInSeconds = 60,
      MaxRetries = 2
  });
  ```
</CodeGroup>

## Send a Message

Here's how to send a basic notification message:

<CodeGroup>
  ```javascript Node.js
  const { requestId } = await courier.send({
    message: {
      to: {
        email: "email@example.com",
      },
      content: {
        title: "Welcome!",
        body: "Thanks for signing up, {{name}}",
      },
      data: {
        name: "Peter Parker",
      },
      routing: {
        method: "single",
        channels: ["email"],
      },
    },
  });
  ```

  ```python Python
  response = client.send(
    message=courier.ContentMessage(
      to=courier.UserRecipient(
        email="email@example.com",
        data={
          "name": "Peter Parker",
        }
      ),
      content=courier.ElementalContentSugar(
        title="Welcome!",
        body="Thanks for signing up, {{name}}",
      ),
      routing=courier.Routing(
        method= "single",
        channels=["email"]
      )
    )
  )
  ```

  ```ruby Ruby
  res = client.send({
      message: {
          to: {
            "email" => "email@example.com",
          },
          content: {
            "title" => "Welcome!",
            "body" => "Thanks for signing up, {{name}}",
          },
          data: {
            "name" => "Peter Parker",
          },
          routing: {
            "method" => "single",
            "channels" => ["email"],
          },
      },
  })
  ```

  ```php PHP
  $result = $courier->sendEnhancedNotification(
    (object) [
      'to' => [
        'email' => "email@example.com",
      ],
      'content' => [
        'title' => "Welcome!",
        'body' => "Thanks for signing up, {{name}}",
      ],
      'data' => [
        'name' => "Peter Parker",
      ],
      'routing' => [
        'method' => "single",
        'channels' => ["email"],
      ],
    ],
  );
  ```

  ```java Java
  SendEnhancedRequestBody request = new SendEnhancedRequestBody();
  SendRequestMessage message = new SendRequestMessage();

  HashMap<String, String> to = new HashMap<String, String>();
  to.put("email", "email@example.com");
  message.setTo(to);

  HashMap<String, Object> content = new HashMap<String, Object>();
  content.put("title", "Welcome!");
  content.put("body", "Thanks for signing up, {{name}}");
  message.setContent(content);

  HashMap<String, Object> data = new HashMap<String, Object>();
  data.put("name", "Peter Parker");
  message.setData(data);

  HashMap<String, Object> routing = new HashMap<String, Object>();
  routing.put("method", "single");
  routing.put("channels", ["email"]);
  message.setRouting(routing);

  request.setMessage(message);
  SendEnhancedResponseBody response = new SendService().sendEnhancedMessage(request);
  ```

  ```go Go
  requestID, err := client.SendMessage(
    context.Background(),
    courier.SendMessageRequestBody{
      Message: map[string]interface{}{
        "to": map[string]string{
          "email": "email@example.com",
        },
        "content": map[string]string{
          "title": "Welcome!",
          "body": "Thanks for signing up, {{name}}",
        },
        "data": map[string]string{
          "name": "Peter Parker",
        },
        "routing": map[string]interface{}{
          "method": "single",
          "channels": []string{"email"},
        },
      },
    },
  )

  if err != nil {
    log.Fatal(err)
  }
  log.Printf("Message sent! Request ID: %s", requestID)
  ```

  ```csharp C#
  try 
  {
      var response = await courier.SendAsync(
          new SendMessageRequest 
          {
              Message = new Message 
              {
                  To = new Recipient 
                  {
                      Email = "email@example.com"
                  },
                  Content = new MessageContent 
                  {
                      Title = "Welcome!",
                      Body = "Thanks for signing up, {{name}}"
                  },
                  Data = new Dictionary<string, object> 
                  {
                      { "name", "Peter Parker" }
                  },
                  Routing = new MessageRouting 
                  {
                      Method = "single",
                      Channels = new[] { "email" }
                  }
              }
          });

      Console.WriteLine($"Message sent! Request ID: {response.RequestId}");
  }
  catch (CourierException e)
  {
      Console.WriteLine($"Error: {e.Message}");
      Console.WriteLine($"Status Code: {e.StatusCode}");
  }
  ```
</CodeGroup>

### Message Properties

The message object contains these main properties:

* `to`: Identifies the recipient (email address, phone number, etc.)
* `content`: The notification's title and body
* `data`: Variables to populate message templates
* `routing`: Controls which channel(s) deliver the message

The API call returns a request ID:

```json
{ "requestId": "87e7c05b-4f46-fda24e356e23" }
```

Monitor notification status in the [logs](https://app.courier.com/logs).

## Option 2: Design via UI (Product Teams)

Prefer a visual approach? Create notifications using Courier's drag-and-drop Notification Designer, then use the generated code snippets to integrate with your application.

### Prerequisites

1. [Sign up](https://app.courier.com/signup) for a Courier account
2. Add an [integration](/external-integrations/integrations-overview) (like SendGrid for email)

### Step 1: Create a Notification

Navigate to the Designer and select "New" to get the option to create a new template.

<Frame caption="Create Your First Template">
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/courier-4f1f25dc/assets/getting-started/create-template.png" alt="Create a new template" />
</Frame>

### Step 2: Add Channels

Click "+ Add Channel" to add email, SMS, push, or chat channels to your notification.

<Frame caption="Add Notification Channels">
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/courier-4f1f25dc/assets/getting-started/add-channels.png" alt="Add channel interface" />
</Frame>

### Step 3: Design Content

Use content blocks to build your notification. Add text, images, buttons, and other elements that automatically adapt to each channel.

<Frame caption="Design Notification Content">
  <img src="https://mintlify.s3.us-west-1.amazonaws.com/courier-4f1f25dc/assets/getting-started/design-content.png" alt="Content design interface" />
</Frame>

### Step 4: Publish and Send

Click "Publish Changes" to make your notification available, then use the [Send API](../reference/send/message) to trigger it from your application.

And that's it! You've created your first template with the designer.

## Next Steps

<CardGroup cols={2}>
  <Card title="Send API Reference" href="../reference/send/message" icon="paper-plane">
    Complete API documentation for sending
  </Card>

  <Card title="Content Management" href="../platform/content/content-overview" icon="page">
    Learn about template creation approaches
  </Card>

  <Card title="Integration Setup" href="../external-integrations/integrations-overview" icon="plug">
    Connect to notification providers
  </Card>

  <Card title="Platform Overview" href="./intro-to-platform" icon="layer-group">
    Understand Courier's features
  </Card>
</CardGroup>

<Info>
  **Pro Tip**: Both approaches (API and UI) can be used together. Design your notification templates visually, then use the generated code snippets to send them programmatically from your application.
</Info>
