# @tradle/credstash-cli

This is a command line client for [credstash](https://github.com/tradle/nodecredstash)

### Usage

Usage modeled after the original https://github.com/fugue/credstash

```sh
# put (template)
nodecredstash put -p [profile] -r [region] -b [bucket] --folder [folder] -k [keyIdOrAlias] -v [version] -c=[contextVar1=contextVal1,...contextVarN=contextValN] [name] [value]

# put first version (example)
nodecredstash put -p myprofile -r us-east-1 -b mybucket --folder secrets -k alias/credstash -c="bill=ted,excellent=adventure" favcolor blue

# put nth version (example)
nodecredstash put -p myprofile -r us-east-1 -b mybucket --folder secrets -k alias/credstash -c="bill=ted,excellent=adventure" -v 0000000000000000002 favcolor pink

# get (template)
nodecredstash get -p [profile] -r [region] -b [bucket] --folder [folder] -k [keyIdOrAlias] -v [version] -e [encoding] -c=[contextVar1=contextVal1,...contextVarN=contextValN] [name]

# get (example)
nodecredstash get -p myprofile -r us-east-1 -b mybucket --folder secrets -k alias/credstash -e utf8 -c="bill=ted,excellent=adventure" favcolor

# list all versions of a secret (template)
nodecredstash list -p [profile] -r [region] -b [bucket] --folder [folder] -k [keyIdOrAlias] [name]

# list all versions of a secret (example)
nodecredstash list -p myprofile -r us-east-1 -b mybucket --folder secrets -k alias/credstash favcolor

# list all versions of all secrets (template)
nodecredstash list -p [profile] -r [region] -b [bucket] --folder [folder] -k [keyIdOrAlias]

# list all versions of all secrets (example)
nodecredstash list -p myprofile -r us-east-1 -b mybucket --folder secrets -k alias/credstash
```
