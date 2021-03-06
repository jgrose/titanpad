/**
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import("dateutils");
import("sqlbase.sqlobj");

function run() {
  var allDomains = sqlobj.selectMulti('pro_domains', {}, {});
  
  allDomains.forEach(function(domain) {
    var domainId = domain.id;
    var accounts = sqlobj.selectMulti('pro_accounts', {domainId: domainId}, {});
    if (accounts.length > 3) {
      if (! sqlobj.selectSingle('billing_purchase', {product: "ONDEMAND", customer: domainId}, {})) {
        sqlobj.insert('billing_purchase', {
          product: "ONDEMAND",
          paidThrough: dateutils.noon(new Date(Date.now()-1000*86400)),
          type: 'subscription',
          customer: domainId,
          status: 'inactive',
          cost: 0,
          coupon: ""
        });
      }
    }
  });
}
