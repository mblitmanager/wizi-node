# API Response Parity Reference Guide

## Overview
This document defines the standardized API response format used across all Node.js (NestJS) controllers to ensure parity with the Laravel backend.

## Standardized Response Format

### Success Response - Data
```json
{
  "success": true,
  "data": { ... },
  "status": 200
}
```

### Success Response - Array
```json
{
  "success": true,
  "data": [ ... ],
  "status": 200
}
```

### Success Response - Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "total_pages": 10
  },
  "status": 200
}
```

### Success Response - No Data
```json
{
  "success": true,
  "status": 200
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## ApiResponseService Methods

### Method 1: Simple Success
```typescript
apiResponse.success()
// Response: { success: true, status: 200 }
```

### Method 2: Success with Data
```typescript
apiResponse.success(item)
// Response: { success: true, data: item, status: 200 }
```

### Method 3: Success with Array
```typescript
apiResponse.success(items)
// Response: { success: true, data: items, status: 200 }
```

### Method 4: Paginated Success
```typescript
apiResponse.paginated(items, total, page, limit)
// Response: { 
//   success: true, 
//   data: items, 
//   pagination: { total, page, limit, total_pages }, 
//   status: 200 
// }
```

### Method 5: Token Response
```typescript
apiResponse.token(token, user)
// Response: { 
//   success: true, 
//   data: { token, user }, 
//   status: 200 
// }
```

## Controller Pattern Examples

### GET List (Pagination)
```typescript
@Get()
async list(@Query("page") page = 1, @Query("limit") limit = 10) {
  const [data, total] = await this.repo.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return this.apiResponse.paginated(data, total, page, limit);
}
```

### GET by ID
```typescript
@Get(":id")
async findOne(@Param("id") id: number) {
  const item = await this.repo.findOne({ where: { id } });
  if (!item) {
    throw new NotFoundException("Item not found");
  }
  return this.apiResponse.success(item);
}
```

### POST Create
```typescript
@Post()
async create(@Body() data: any) {
  if (!data.requiredField) {
    throw new BadRequestException("requiredField is required");
  }
  const entity = this.repo.create(data);
  const saved = await this.repo.save(entity);
  return this.apiResponse.success(saved);
}
```

### PUT Update
```typescript
@Put(":id")
async update(@Param("id") id: number, @Body() data: any) {
  const item = await this.repo.findOne({ where: { id } });
  if (!item) {
    throw new NotFoundException("Item not found");
  }
  await this.repo.update(id, data);
  const updated = await this.repo.findOne({ where: { id } });
  return this.apiResponse.success(updated);
}
```

### DELETE
```typescript
@Delete(":id")
async remove(@Param("id") id: number) {
  const item = await this.repo.findOne({ where: { id } });
  if (!item) {
    throw new NotFoundException("Item not found");
  }
  await this.repo.delete(id);
  return this.apiResponse.success();
}
```

## Error Handling

All HTTP exceptions are automatically caught by the global `AllExceptionsFilter` and converted to the standardized error format:

### Caught Exceptions:
```typescript
throw new NotFoundException("Resource not found");
// → { success: false, error: "Resource not found", status: 404 }

throw new BadRequestException("Invalid input");
// → { success: false, error: "Invalid input", status: 400 }

throw new UnauthorizedException("Invalid credentials");
// → { success: false, error: "Invalid credentials", status: 401 }

throw new ForbiddenException("Access denied");
// → { success: false, error: "Access denied", status: 403 }
```

## HTTP Status Codes

- **200** - OK (successful GET, PUT, PATCH, DELETE)
- **201** - Created (successful POST)
- **400** - Bad Request (invalid input, validation errors)
- **401** - Unauthorized (missing or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (duplicate entry)
- **422** - Unprocessable Entity (validation failed)
- **500** - Internal Server Error

## Response Headers

All responses include standard HTTP headers:
```
Content-Type: application/json
X-Request-Id: [unique-id] (optional)
Access-Control-Allow-Origin: * (CORS enabled)
```

## Validation Best Practices

### Input Validation
Always validate required fields and throw `BadRequestException` with clear messages:

```typescript
if (!data.email) {
  throw new BadRequestException("email is required");
}

if (!isValidEmail(data.email)) {
  throw new BadRequestException("email must be a valid email address");
}

if (data.age && data.age < 0) {
  throw new BadRequestException("age must be greater than 0");
}
```

### Resource Existence Check
Always check if resource exists before updating/deleting:

```typescript
const item = await this.repo.findOne({ where: { id } });
if (!item) {
  throw new NotFoundException("Item not found");
}
```

## Pagination Best Practices

### Query Parameters
```
GET /api/resource?page=1&limit=10&search=query&sort=name&order=asc
```

### Default Values
- `page`: 1
- `limit`: 10
- `search`: "" (empty)
- `sort`: "id" (or created_at)
- `order`: "DESC"

### Response Structure
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "total_pages": 15,
    "has_next": true,
    "has_prev": false
  }
}
```

## Authentication

All API endpoints requiring authentication use JWT Bearer tokens:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Protected routes use the `@UseGuards(AuthGuard("jwt"))` decorator.

## Testing API Responses

### With cURL
```bash
# GET with pagination
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/admin/stagiaires?page=1&limit=10"

# POST with data
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John"}' \
  "http://localhost:3000/api/admin/stagiaires"

# PUT update
curl -X PUT -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane"}' \
  "http://localhost:3000/api/admin/stagiaires/1"

# DELETE
curl -X DELETE -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/admin/stagiaires/1"
```

### With Postman
1. Set Authorization type to "Bearer Token"
2. Enter JWT token
3. Set request method (GET, POST, PUT, DELETE)
4. For POST/PUT, set body to raw JSON
5. Send and check response

## Database Relations

All controllers load necessary relations:

```typescript
const item = await this.repo.findOne({
  where: { id },
  relations: ["user", "formations", "stagiaires"], // Load related entities
});
```

## Performance Considerations

### Pagination Performance
```typescript
// Always skip before take for database optimization
const [data, total] = await query
  .skip((page - 1) * limit)
  .take(limit)
  .orderBy("entity.created_at", "DESC")
  .getManyAndCount();
```

### Query Optimization
```typescript
// Use leftJoinAndSelect for efficient querying
const query = this.repo.createQueryBuilder("e")
  .leftJoinAndSelect("e.user", "user")
  .leftJoinAndSelect("e.formations", "formations");

if (search) {
  query.where("e.name LIKE :search OR user.email LIKE :search", {
    search: `%${search}%`,
  });
}

const [data, total] = await query
  .skip((page - 1) * limit)
  .take(limit)
  .getManyAndCount();
```

## Logging

The `AllExceptionsFilter` automatically logs all errors:

```typescript
// Example log output:
// [ERROR] [POST /api/admin/stagiaires] - BadRequestException: name is required
// [ERROR] [GET /api/admin/stagiaires/999] - NotFoundException: Stagiaire not found
```

---

**Last Updated**: 2025-01-28
**Status**: Production Ready
**Version**: 1.0
