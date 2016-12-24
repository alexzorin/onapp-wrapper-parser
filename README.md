# onapp-wrapper-parser

This parses the OnApp PHP Wrapper in order to extract the various structures that represent the API.

It works by extracting the AST from the OnApp code, and then parses the AST for structure fields and types.

It provides JSON output that can be fed into code-generation tools.

## Running

Easiest way is by Docker.

```
docker build -t onapp-wrapper .
```

and then you can run:

```
docker run -v $(pwd):/work --rm onapp-wrapper
```

which will produce output into the `generated/` directory.

## Example Output

```
{
  "name": "OnApp_Disk",
  "fields": {
    "id": {
      "type": "integer"
    },
    "created_at": {
      "type": "datetime"
    },
    "updated_at": {
      "type": "datetime"
    },
    "add_to_linux_fstab": {
      "type": "boolean"
    },
    "disk_size": {
      "type": "integer",
      "required": true
    },
    "primary": {
      "type": "boolean"
    },
    "data_store_id": {
      "type": "integer",
      "required": true
    },
    "disk_vm_number": {
      "type": "integer"
    },
    "is_swap": {
      "type": "boolean"
    },
    "mount_point": {},
    "identifier": {},
    "file_system": {},
    "virtual_machine_id": {
      "type": "integer"
    },
    "require_format_disk": {
      "type": "integer"
    },
    "built": {
      "type": "boolean"
    },
    "locked": {
      "type": "boolean"
    },
    "has_autobackups": {
      "type": "boolean"
    },
    "add_to_freebsd_fstab": {
      "type": "string"
    },
    "burst_bw": {
      "type": "integer"
    },
    "burst_iops": {
      "type": "string"
    },
    "integrated_storage_cache_enabled": {
      "type": "boolean"
    },
    "integrated_storage_cache_override": {
      "type": "boolean"
    },
    "integrated_storage_cache_settings": {
      "type": "string"
    },
    "iqn": {
      "type": "string"
    },
    "label": {
      "type": "string"
    },
    "max_bw": {
      "type": "integer"
    },
    "max_iops": {
      "type": "integer"
    },
    "min_iops": {
      "type": "string"
    },
    "volume_id": {
      "type": "string"
    },
    "mounted": {
      "type": "boolean"
    }
  }
}
```
