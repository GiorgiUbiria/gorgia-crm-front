# Chat Room System Documentation

## Overview

The chat room system provides real-time messaging capabilities with support for both private (one-to-one) and group chats. The system includes features such as file sharing, read receipts, and real-time message delivery using WebSocket connections.

## Authentication

All chat endpoints require authentication using Laravel Sanctum. Include the authentication token in the request headers:

```
Authorization: Bearer <your-token>
```

## API Endpoints

### Chat Rooms

#### List Chat Rooms

```
GET /api/chat/rooms
```

Returns all chat rooms where the authenticated user is a participant.

Response:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Group Chat Name",
      "type": "group",
      "description": "Optional description",
      "created_by": 1,
      "created_at": "2024-03-21T10:00:00.000000Z",
      "updated_at": "2024-03-21T10:00:00.000000Z",
      "unread_count": 5,
      "other_participant": null
    }
  ]
}
```

#### Create Chat Room

```
POST /api/chat/rooms
```

Create a new private or group chat room.

Request Body:

```json
{
  "type": "private|group",
  "name": "Group name (required for group chats)",
  "description": "Optional description",
  "participants": [1, 2, 3]
}
```

Response:

```json
{
  "message": "Chat room created successfully",
  "data": {
    "id": 1,
    "name": "Group Chat Name",
    "type": "group",
    "description": "Optional description",
    "created_by": 1,
    "created_at": "2024-03-21T10:00:00.000000Z",
    "updated_at": "2024-03-21T10:00:00.000000Z",
    "participants": [
      {
        "id": 1,
        "name": "John",
        "sur_name": "Doe",
        "pivot": {
          "role": "admin",
          "joined_at": "2024-03-21T10:00:00.000000Z"
        }
      }
    ]
  }
}
```

#### Get Chat Room

```
GET /api/chat/rooms/{chatRoom}
```

Get details of a specific chat room and its recent messages.

Response:

```json
{
    "data": {
        "id": 1,
        "name": "Group Chat Name",
        "type": "group",
        "description": "Optional description",
        "created_by": 1,
        "created_at": "2024-03-21T10:00:00.000000Z",
        "updated_at": "2024-03-21T10:00:00.000000Z",
        "participants": [...],
        "messages": [...]
    }
}
```

#### Update Chat Room (Group Only)

```
PUT /api/chat/rooms/{chatRoom}
```

Update a group chat room's details. Only admin can perform this action.

Request Body:

```json
{
  "name": "New Group Name",
  "description": "New description"
}
```

#### Add Participants (Group Only)

```
POST /api/chat/rooms/{chatRoom}/participants
```

Add new participants to a group chat. Only admin can perform this action.

Request Body:

```json
{
  "participants": [1, 2, 3]
}
```

#### Remove Participant (Group Only)

```
DELETE /api/chat/rooms/{chatRoom}/participants/{user}
```

Remove a participant from a group chat. Admin can remove anyone, users can remove themselves.

### Messages

#### List Messages

```
GET /api/chat/rooms/{chatRoom}/messages
```

Get messages for a chat room with optional pagination.

Query Parameters:

- `before`: Message ID to fetch messages before (for pagination)

Response:

```json
{
  "data": [
    {
      "id": 1,
      "chat_room_id": 1,
      "user_id": 1,
      "message": "Hello!",
      "type": "text",
      "file_path": null,
      "file_name": null,
      "read_at": null,
      "created_at": "2024-03-21T10:00:00.000000Z",
      "updated_at": "2024-03-21T10:00:00.000000Z",
      "user": {
        "id": 1,
        "name": "John",
        "sur_name": "Doe"
      }
    }
  ]
}
```

#### Send Message

```
POST /api/chat/rooms/{chatRoom}/messages
```

Send a new message to the chat room.

Request Body (multipart/form-data):

```
message: "Message text"
type: "text|image|file"
file: [file upload]
```

Response:

```json
{
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "chat_room_id": 1,
    "user_id": 1,
    "message": "Hello!",
    "type": "text",
    "file_path": null,
    "file_name": null,
    "created_at": "2024-03-21T10:00:00.000000Z",
    "updated_at": "2024-03-21T10:00:00.000000Z",
    "user": {
      "id": 1,
      "name": "John",
      "sur_name": "Doe"
    }
  }
}
```

#### Mark Messages as Read

```
POST /api/chat/rooms/{chatRoom}/messages/read
```

Mark multiple messages as read.

Request Body:

```json
{
  "message_ids": [1, 2, 3]
}
```

#### Delete Message

```
DELETE /api/chat/rooms/{chatRoom}/messages/{message}
```

Delete a message. Users can only delete their own messages.

## Real-time Events

### New Message Event

When a new message is sent, it's broadcast to all participants in the chat room through a presence channel.

Channel Name: `chat.room.{roomId}`

Event Data:

```json
{
  "id": 1,
  "chat_room_id": 1,
  "user": {
    "id": 1,
    "name": "John",
    "sur_name": "Doe"
  },
  "message": "Hello!",
  "type": "text",
  "file_path": null,
  "file_name": null,
  "created_at": "2024-03-21T10:00:00.000000Z"
}
```

Subscribe to new messages:

```javascript
Echo.join(`chat.room.${roomId}`).listen("NewChatMessage", e => {
  // Handle new message
  console.log(e)
})
```

## File Uploads

- Supported file types: Any
- Maximum file size: 10MB
- Files are stored in: `storage/app/public/chat-files/{chatRoomId}/`
- File URLs are relative to your storage URL

## Error Handling

All endpoints return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 403: Unauthorized
- 422: Validation Error
- 500: Server Error

Error Response Format:

```json
{
  "message": "Error message here"
}
```

## Best Practices

1. Implement proper error handling for all API calls
2. Use WebSocket presence channels for real-time updates
3. Implement message pagination when loading chat history
4. Handle file uploads with proper progress indicators
5. Implement retry logic for failed message sends
6. Cache chat room and participant data locally
7. Implement proper offline support
8. Handle read receipts in real-time
