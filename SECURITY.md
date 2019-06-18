# Security Policy

## Reporting a Vulnerability


MyCrypto is a cryptocurrency interface that allows people to interact with their cryptocurrency assets in a way that is more user-friendly than other solutions. We do not hold custody of any customer's assets nor do we collect personally-identifiable information about any of our customers, so our security policy is centered on how well our software allows people to safely and privately interact with their own assets.

MyCrypto looks forward to working with the security community to find security vulnerabilities in order to keep our businesses and customers safe. We are particularly interested in vulnerabilities found in the application layer, but any vulnerability across our stack that could lead to compromise of user funds is within scope (except as listed in  **"Out of Scope"**).

## Vulnerability Response Process

### Preliminary Statement

1.  Please refrain from committing the following acts, as they will not be recognized as an exploit on our platform:
    
    -   Denial of Service attacks to any servers running MyCrypto software, 3rd party software we rely on (such as our Geth and Parity nodes), or APIs we rely on.
        
    -   Social engineering manipulation of MyCrypto staff members or contractors.
        
    -   Attempts to gain physical access to hardware that MyCrypto uses.
        
2.  Other instances running our software (private or public forks, domains that are not listed in  **“In Scope”**  but are running our software) are not in scope - only the code under the  `mycryptohq`  namespace on GitHub.com is (with a select few other projects under the MyCrypto banner but a different namespace) - see the  **"In Scope"**  section for more information.
    
3.  Bounties and disclosure process will be run under our  [HackerOne program](https://hackerone.com/mycrypto "https://hackerone.com/mycrypto").
    
    -   Anyone who emails a matter that is eligible for a bounty / public disclosure to [security@mycrypto.com](mailto:security@mycrypto.com) (or the other emails listed below in **"Avenues to Contact"**) will be directed to open a ticket with our  [HackerOne program](https://hackerone.com/mycrypto "https://hackerone.com/mycrypto")  or a ticket will be opened on their behalf.
        
4.  Bounties (if applicable) will not be rewarded if the vulnerability / exploit is made public before:
    
    -   It has been made known to us through the  [HackerOne program](https://hackerone.com/mycrypto "https://hackerone.com/mycrypto").
        
    -   You have given us enough time from responsible disclosure (90 days) to patch.
        
5.  A researcher will open one vulnerability per report with enough details for us to start an investigation.
    

### Avenues to Contact

-   HackerOne:  [https://hackerone.com/mycrypto](https://hackerone.com/mycrypto "https://hackerone.com/mycrypto")
    
-   Email: [security@mycrypto.com](mailto:security@mycrypto.com) - PGP fingerprint:  [BE7B 7A02 069B A692 E759 A7FC 5245 6166 91A3 EE98](https://keybase.io/mycrypto/pgp_keys.asc?fingerprint=be7b7a02069ba692e759a7fc5245616691a3ee98)
    
-   Email: [harry@mycrypto.com](mailto:harry@mycrypto.com) - PGP fingerprint:  [5E1F 6F7F 1BA7 C31B 0455 B504 1DF9 D1E1 E9B5 C0D2](https://pgp.mit.edu/pks/lookup?op=get&search=0x1DF9D1E1E9B5C0D2)
    
-   Email: [mia@mycrypto.com](mailto:mia@mycrypto.com) - PGP fingerprint: [74F5 3783 F6C4 C6E5 A467 D63C 2792 C9AB 5B72 F196](https://keybase.io/miagx/pgp_keys.asc?fingerprint=74f53783f6c4c6e5a467d63c2792c9ab5b72f196)
-   Email: [taylor@mycrypto.com](mailto:taylor@mycrypto.com) - PGP fingerprint: FF65 5D72 A0DB 81E9 4A8C 12FB E8C6 DD68 17C6 2CBA
-   Email: [tayvano@gmail.com](mailto:tayvano@gmail.com) - PGP fingerprint: 1B7A 2D12 DE76 F0F0 A215 3B62 697F 4D4B 81B1 5C84

### Response Team

-   Harry Denley ([@409h](https://keybase.io/409h "https://keybase.io/409h"))
    
-   Blurpesec ([@blurpesec](https://keybase.io/blurpesec "https://keybase.io/blurpesec"))
    
-   Taylor Monahan ([@tayvano](https://keybase.io/tayvano "https://keybase.io/tayvano"))
    
-   Mia Alexander ([@miagx](https://keybase.io/miagx))

### SLA

MyCrypto will make a best effort to meet the following SLAs for hackers participating in our program:

-   Time to first response (from report submit) - 3 business days
-   Time to triage (from report submit) - 9 business days

We’ll try to keep you informed about our progress throughout the process.

### Incident Response

1.  A ticket is opened on our  [HackerOne program](https://hackerone.com/mycrypto "https://hackerone.com/mycrypto")  with details about the vulnerability (outlining the impacts) and enough information to replicate it.
    
    -   If there is not enough information to replicate the issue, we will ask for more
        
    -   We will contact you if your issue:
        
        -   Has already been noticed internally and is included in a scheduled release (a public acknowledgment will still be made to reporters who have opened a ticket about it before release)
            
        -   Is either out-of-scope or a non-issue - the process will halt here until the issue becomes in-scope/a valid vulnerability.
            
2.  We will verify and internally escalate the issue with the appropriate team (dev, infra, ...)
    
3.  We will discuss internally and establish the severity of the vulnerability - any dispute about the classification of the vulnerability can be discussed but the MyCrypto team will ultimately define it.
    
    -   **HIGH**  - User funds are at risk of being taken maliciously or user secrets are at risk of being exposed - anything that directly affects user funds/secrets with ease.
        
    -   **MEDIUM**  - Exploits in the software that give the user bad data, which could lead users to take actions that expose themselves to risk.
        
    -   **LOW**  - Issues that are low impact to users or are extremely hard to do (e.g., needing very specific hardware)
        
4.  We will respond to you within three days, acknowledging that we have verified the issue, escalated it internally as appropriate, and classified it.
    
5.  We will develop a patch and communicate with the researcher to validate.
    
    -   The vulnerability is still to be treated as private
        
    -   The researcher is given a private branch to verify the patch (if code related - this could be a staging URL for the patch) or asked to verify externally (if infrastructure related)
        
6.  A vulnerability announcement is drafted (using an internal template that includes the severity, details of the patch, and acknowledgment to the researcher(s))
    
    -   A release date is internally discussed and set
        
7.  At release date, we coordinate with the developers (if code-related vulnerability) to include the vulnerability announcement in the release notes (published on our repository at GitHub)
    

Please also refer to [HackerOne Disclosure Guidelines](https://www.hackerone.com/disclosure-guidelines).

### Post-Release Disclosure Process

1.  The team has 90 days to go through the life cycle of a valid vulnerability report and issue a patch to production.
    
2.  The published vulnerability announcement will acknowledge the reporter(s)
    
    -   The reporter will be named by default, but can be kept anonymous upon request
        
    -   The published announcement will detail:
        
        -   The project affected (repository name / infrastructure descriptor)
            
        -   The versions of software known to be affected
            
        -   The versions of software known not to be affected (e.g., exploit was unintentionally introduced in v1.5 - anything prior to this version is unaffected)
            
        -   The versions of software that were not checked (e.g., versions that are now considered EOL by the MyCrypto team)
            
        -   Any mitigating factors (e.g., the vulnerability is only present in non-default configurations on a specific environment)
            
3.  If a bounty is applicable, the bounty process will be started.
    

### Bounty Distribution

MyCrypto has not set standards for bounty rewards, whether they be monetary, "swag," or otherwise. Bounty rewards, when applicable, will be considered on a case-by-case basis and are at the sole discretion of MyCrypto.

If your report has been considered for a bounty, this will be communicated to you on HackerOne and handled off-channel (usually via e-mail) to get the reporters details (either shipping details for swag rewards or details to send a monetary bounty.)

### In Scope

MyCrypto manages many applications under different domains.

-   buy.mycrypto.com
    
-   support.mycrypto.com
    
-   overflow.mycrypto.com
    
-   about.mycrypto.com
    
-   www.mycrypto.com
    
-   beta.mycrypto.com
    
-   download.mycrypto.com
    
-   etherscamdb.info
    
-   cryptoscamdb.org
    
-   ambo.io
-   ambo.herokuapp.com
-   Ambo IOS App (production link found on https://ambo.io/downloads/)

A description of each domain can be found on our knowledge base: [https://support.mycrypto.com/general-knowledge/about-mycrypto/official-domain-names-used-by-mycrypto](https://support.mycrypto.com/general-knowledge/about-mycrypto/official-domain-names-used-by-mycrypto)

Infrastructure and code used on these domains are in scope (except the aspects stated in  **“Out of Scope”**)

### Out of Scope

When reporting vulnerabilities, please consider (1) attack scenario / exploitability, and (2) security impact of the bug. The following issues are considered out of scope:

-   Attacks requiring MITM or physical access to a user's device.
-   Missing best practices in SSL/TLS configuration.
-   Any activity that could lead to the disruption of our service (DoS).
    


Thank you for helping keep MyCrypto and our users safe!
