export type WorkflowGuide = {
  slug: string;
  category: "Site screening" | "Engineering" | "Development" | "Due diligence" | "BESS";
  title: string;
  description: string;
  overview: string;
  questions: string[];
  workflow: string[];
  evidence: string[];
  outputs: string[];
  caution: string;
};

export type WorkflowGuideEnhancement = {
  reviewedAt: string;
  reviewStatus: string;
  marketContext: string[];
  workedExample: {
    title: string;
    basis: string;
    result: string;
    caveat: string;
  };
  sources: Array<{
    name: string;
    url: string;
    use: string;
  }>;
};

export const workflowGuides: WorkflowGuide[] = [
  {
    slug: "utility-scale-solar-site-selection",
    category: "Site screening",
    title: "Utility-Scale Solar Site Selection",
    description: "A practical workflow for comparing candidate solar sites using land, grid, access, terrain, environmental and development evidence.",
    overview: "Solar site selection is a staged decision process, not a search for the parcel with the highest irradiation. A credible comparison records what is known, what is missing and which issues can stop or materially reshape development.",
    questions: ["Is the developable area large and coherent enough?", "Can the project reach a credible grid connection point?", "Do access, terrain or environmental constraints fragment the layout?", "Which evidence must be verified before land commitments?"],
    workflow: ["Define the technology, target capacity and minimum usable area.", "Map the boundary and screen environmental, water, terrain and infrastructure context.", "Separate fatal flaws from mitigable constraints and information gaps.", "Rank candidates using consistent assumptions and record the next investigation for each."],
    evidence: ["Verified candidate boundaries and land-control status", "Current planning and environmental datasets", "Grid connection options and indicative distance", "Access, terrain, drainage and receptor observations"],
    outputs: ["Comparable candidate-site scorecard", "Fatal-flaw and information-gap register", "Prioritized site-investigation plan"],
    caution: "Desktop screening cannot confirm title, consent, grid capacity, ecology, flood safety or constructability. Use competent-authority data and qualified advisers before committing capital or land rights.",
  },
  {
    slug: "solar-site-feasibility-study",
    category: "Engineering",
    title: "Solar Site Feasibility Study",
    description: "Structure an early solar feasibility study around traceable assumptions, spatial constraints, yield, grid, access and decision gates.",
    overview: "An early feasibility study should explain whether a project deserves further expenditure and exactly which uncertainties control that decision. It should connect mapping, technical assumptions and commercial consequences without pretending that preliminary data is design evidence.",
    questions: ["What capacity can the usable land plausibly support?", "Which constraints change layout, cost or schedule?", "What yield range is reasonable at screening stage?", "What must be resolved before the next gate?"],
    workflow: ["Establish the study basis, project boundary and target configuration.", "Screen constraints and develop a preliminary usable-area assumption.", "Estimate indicative capacity, yield, access and grid context.", "Summarize risks, sensitivities, information gaps and a go/hold/stop recommendation."],
    evidence: ["Boundary, area and terrain data", "Resource and climate datasets", "Planning, environmental and flood information", "Grid, road and land evidence"],
    outputs: ["Feasibility basis and assumptions register", "Preliminary layout and energy envelope", "Decision memo with next-stage scope"],
    caution: "Feasibility outputs are screening estimates. They do not replace surveys, grid studies, planning advice, detailed design or a bankable energy-yield assessment.",
  },
  {
    slug: "solar-gis-constraint-screening",
    category: "Site screening",
    title: "Solar GIS Constraint Screening",
    description: "Use GIS evidence to identify intersecting constraints, proximity risks and the usable-area implications for a candidate solar site.",
    overview: "GIS screening is most useful when every layer has a defined decision purpose. Intersection layers identify mapped overlaps, distance layers describe context, and unavailable sources remain visible rather than being treated as favourable.",
    questions: ["Which mapped constraints intersect the site?", "Which nearby features require buffers or specialist review?", "How much of the gross area may remain usable?", "How current and authoritative is each dataset?"],
    workflow: ["Validate the site polygon and coordinate reference system.", "Run intersection and proximity checks using named data sources.", "Quantify affected area where geometry supports it.", "Record source dates, limitations and verification actions in a constraint register."],
    evidence: ["Saved site boundary", "Protected-area and flood geometries", "Water, infrastructure and terrain context", "Source URLs, versions and retrieval dates"],
    outputs: ["Constraint map and legend", "Affected-area and proximity summary", "Traceable constraint register"],
    caution: "Absence from a web map is not evidence of absence. Dataset coverage, scale, update cycles and legal status must be checked with the relevant authority.",
  },
  {
    slug: "solar-land-area-estimation",
    category: "Engineering",
    title: "Solar Land Area and Capacity Estimation",
    description: "Translate gross boundary area into a defensible preliminary usable area and indicative solar capacity range.",
    overview: "Gross hectares should never be converted directly into megawatts. The calculation needs explicit deductions for setbacks, terrain, drainage, access, grid infrastructure and environmental constraints, followed by a technology-specific density range.",
    questions: ["What is the verified gross boundary area?", "Which exclusions remove or fragment land?", "What density range fits the likely technology?", "How sensitive is capacity to the largest unknowns?"],
    workflow: ["Measure gross area and perimeter from a controlled boundary.", "Map fixed exclusions and provisional development buffers.", "Calculate contiguous usable areas rather than one net percentage only.", "Apply a capacity-density range and report sensitivities."],
    evidence: ["Boundary survey or controlled GIS polygon", "Constraint and buffer assumptions", "Topography and drainage context", "Technology and spacing basis"],
    outputs: ["Gross-to-usable area bridge", "Indicative MW range", "Assumption and sensitivity table"],
    caution: "Land-density benchmarks vary with module, tracker, inverter, terrain, setbacks and market rules. The estimate is not a layout or guaranteed capacity.",
  },
  {
    slug: "solar-energy-yield-screening",
    category: "Engineering",
    title: "Indicative Solar Energy Yield Screening",
    description: "Build an early-stage solar yield estimate with transparent resource, geometry, loss and uncertainty assumptions.",
    overview: "A screening yield gives a comparable resource signal before detailed design. Its value comes from consistency and transparency: dataset, period, mounting assumptions and losses should be visible beside the result.",
    questions: ["Which irradiation dataset and time period are used?", "What tilt, azimuth and mounting system are assumed?", "Which losses are included?", "What uncertainty is appropriate at this stage?"],
    workflow: ["Select a representative project coordinate and resource source.", "Set preliminary geometry and system-loss assumptions.", "Calculate specific yield and a simple annual energy range.", "Compare alternatives and define the scope for a bankable assessment."],
    evidence: ["PVGIS or equivalent resource output", "Technology and geometry assumptions", "Loss breakdown", "Interannual variability context"],
    outputs: ["Indicative kWh/kWp/year", "Assumption and loss table", "Sensitivity range for early decisions"],
    caution: "A centroid-based PVGIS result is not a bankable P50/P90 study and does not model detailed layout, shading, availability, clipping or long-term degradation.",
  },
  {
    slug: "solar-grid-connection-screening",
    category: "Site screening",
    title: "Solar Grid Connection Screening",
    description: "Assess early grid plausibility using connection distance, voltage context, route constraints, capacity evidence and programme risk.",
    overview: "Proximity to a line or substation is only a starting point. A credible screen distinguishes mapped infrastructure from confirmed connection rights and makes route, voltage, capacity and queue uncertainty explicit.",
    questions: ["What connection voltage is plausible for the target capacity?", "Which substations or lines are geographically relevant?", "Can a connection route be secured and permitted?", "What capacity and queue evidence is available?"],
    workflow: ["Define target export capacity and likely voltage range.", "Map nearby substations and transmission assets.", "Review route length, crossings, land and environmental constraints.", "Engage the network operator and track application evidence separately from GIS proximity."],
    evidence: ["Network maps and operator publications", "Substation and line attributes", "Connection-route corridor", "Capacity, queue and application correspondence"],
    outputs: ["Connection-options shortlist", "Route and interface risk summary", "Grid engagement action plan"],
    caution: "Mapped infrastructure does not demonstrate spare capacity, feasible protection, acceptable fault levels, a connection offer or land rights for the route.",
  },
  {
    slug: "solar-substation-proximity-analysis",
    category: "Site screening",
    title: "Solar Substation Proximity Analysis",
    description: "Interpret substation distance as one part of connection screening rather than evidence of available grid capacity.",
    overview: "A nearby substation can reduce route length, but suitability depends on voltage, configuration, ownership, expansion scope and network studies. Proximity analysis should identify candidates and questions, not promise access.",
    questions: ["What is the nearest relevant-voltage substation?", "Is the straight-line route physically meaningful?", "What crossings or settlements affect a cable route?", "Who owns the asset and controls connection studies?"],
    workflow: ["Filter substations by known or plausible voltage.", "Measure boundary-to-asset distance and map route corridors.", "Identify land, road, rail, water and environmental crossings.", "Request authoritative network information and update the option ranking."],
    evidence: ["Substation location and voltage data", "Topographic and cadastral context", "Potential cable-route corridors", "Network-owner confirmation"],
    outputs: ["Substation option map", "Route-length and crossing schedule", "Verification questions for the network operator"],
    caution: "Open mapping can omit assets or attributes. Always verify location, voltage, ownership and capacity with the network operator.",
  },
  {
    slug: "solar-transmission-line-proximity",
    category: "Site screening",
    title: "Solar Transmission Line Proximity Screening",
    description: "Screen transmission-line context, voltage, crossing exposure and connection-route implications for a solar project.",
    overview: "Transmission-line proximity can indicate network context but also create easements, clearances and crossing constraints. The same mapped line may be an opportunity, a site constraint or irrelevant to the intended connection.",
    questions: ["What voltage and ownership are recorded?", "Does the line cross or merely pass near the site?", "Which statutory clearances or easements apply?", "Would connection require a new switching station?"],
    workflow: ["Classify nearby lines by voltage and data confidence.", "Measure intersection and minimum distance to the site.", "Map potential easements, crossings and compound requirements.", "Confirm the connection concept with the asset owner."],
    evidence: ["Line geometry and voltage attributes", "Easement or wayleave information", "Site and route survey", "Network connection concept"],
    outputs: ["Line-proximity schedule", "Crossing and clearance constraints", "Connection-concept questions"],
    caution: "A line on a map is not automatically connectable. Electrical studies, ownership, outage strategy and a formal offer determine feasibility.",
  },
  {
    slug: "solar-access-road-screening",
    category: "Site screening",
    title: "Solar Site Access Road Screening",
    description: "Review public-road proximity, delivery routes, site entrances and internal access constraints at early stage.",
    overview: "Access screening must follow the full logistics route, not only the nearest mapped road. Bridge limits, gradients, turning radii, settlements, land rights and construction traffic can control feasibility and cost.",
    questions: ["Where is the nearest suitable public road?", "Can abnormal or heavy deliveries reach the site?", "Is a safe entrance achievable?", "Which off-site upgrades or rights may be required?"],
    workflow: ["Map candidate entrances and public-road connections.", "Trace delivery routes to major transport corridors.", "Flag structures, gradients, width restrictions and sensitive receptors.", "Define survey, swept-path and highway-authority actions."],
    evidence: ["Road hierarchy and ownership", "Route imagery and reconnaissance", "Bridge, width and gradient constraints", "Access-right and highway consultation"],
    outputs: ["Access-options plan", "Logistics constraint schedule", "Next-stage transport study scope"],
    caution: "Open road data cannot confirm legal access, pavement capacity, bridge loading, visibility splays or highway approval.",
  },
  {
    slug: "solar-flood-risk-screening",
    category: "Site screening",
    title: "Solar Flood Risk Screening",
    description: "Identify mapped flood exposure and define the hydrology evidence needed before layout or investment decisions.",
    overview: "Flood screening should distinguish strategic reporting areas from design-level flood hazards. It also needs to consider drainage routes, erosion, equipment levels, access resilience and downstream effects.",
    questions: ["Which flood datasets overlap the site?", "What source, return period and hazard type do they represent?", "Could safe access be lost during an event?", "What hydrology and drainage study is needed?"],
    workflow: ["Overlay the boundary with current authority flood datasets.", "Record affected area and dataset limitations.", "Review watercourses, low points and access routes.", "Commission site-specific hydrology and develop mitigation only after validation."],
    evidence: ["Authority flood maps", "Watercourse and catchment context", "Terrain and drainage survey", "Hydrology and hydraulic modelling"],
    outputs: ["Flood-screening map", "Exposure and information-gap summary", "Hydrology study brief"],
    caution: "Strategic flood layers are not design flood levels. Do not size drainage or place critical equipment using screening maps alone.",
  },
  {
    slug: "solar-environmental-constraint-screening",
    category: "Site screening",
    title: "Solar Environmental Constraint Screening",
    description: "Structure desktop environmental screening for protected areas, habitats, species, water, landscape and cumulative effects.",
    overview: "Environmental screening identifies likely survey, permitting and layout implications. It should combine mapped designations with local context and clearly distinguish statutory status from indicative sensitivity.",
    questions: ["Which statutory or non-statutory designations are relevant?", "Which habitats, species or receptors may require surveys?", "Could grid and access routes create separate impacts?", "What seasonal programme constraints apply?"],
    workflow: ["Define site and associated-infrastructure study areas.", "Review designations, habitat context, water and landscape receptors.", "Identify survey requirements and seasonal windows.", "Translate findings into layout constraints, programme actions and specialist scopes."],
    evidence: ["Designation boundaries and citations", "Habitat and land-cover information", "Species records and survey evidence", "Landscape, water and cumulative-development context"],
    outputs: ["Environmental constraints plan", "Survey and consultation schedule", "Preliminary mitigation hierarchy"],
    caution: "Desktop records can be incomplete or sensitive. Qualified ecologists and the competent authorities must define survey sufficiency and legal implications.",
  },
  {
    slug: "natura-2000-solar-project-screening",
    category: "Site screening",
    title: "Natura 2000 Screening for Solar Projects",
    description: "Use mapped Natura 2000 context to identify potential Habitats and Birds Directives implications and next actions.",
    overview: "A site outside a Natura 2000 boundary may still create pathways to a protected site through hydrology, species movement, disturbance or associated infrastructure. Screening needs both geometry and ecological reasoning.",
    questions: ["Does any project component intersect a Natura 2000 site?", "Which qualifying features and conservation objectives apply?", "Are there functional or hydrological connections?", "Could likely significant effects arise alone or in combination?"],
    workflow: ["Map the project, grid route and access against current Natura 2000 data.", "Identify nearby sites, designations and qualifying features.", "Describe impact pathways and information gaps.", "Seek specialist advice on screening and appropriate-assessment requirements."],
    evidence: ["Official Natura 2000 boundaries and site codes", "Standard data forms and conservation objectives", "Ecological connectivity and hydrology", "Project description and construction methods"],
    outputs: ["Natura 2000 context map", "Impact-pathway screening table", "Specialist assessment scope"],
    caution: "Map intersection alone does not determine legal significance. The competent authority and qualified ecological advisers must evaluate effects.",
  },
  {
    slug: "solar-terrain-slope-assessment",
    category: "Engineering",
    title: "Solar Terrain and Slope Assessment",
    description: "Screen elevation range, slope distribution and terrain-driven layout risks before detailed topographic design.",
    overview: "Terrain affects tracker suitability, grading, drainage, road design, pile reveal and usable-area continuity. A regional DEM can reveal patterns, but survey-grade topography is needed for design.",
    questions: ["What are the average, P90 and maximum sampled slopes?", "Where are steep or adverse-aspect areas concentrated?", "Does terrain fragment tracker blocks or access routes?", "What survey resolution is required next?"],
    workflow: ["Sample a consistent elevation grid within the boundary.", "Calculate slope and aspect for clipped terrain cells.", "Map areas outside preliminary technology limits.", "Define topographic survey, grading and drainage studies."],
    evidence: ["DEM source and effective resolution", "Slope and aspect calculations", "Candidate technology limits", "Topographic survey and geotechnical context"],
    outputs: ["Terrain screening summary", "Preliminary terrain-assumption boundary", "Survey and earthworks study scope"],
    caution: "Regional DEMs generalize local breaks and may use different vertical datums. They are unsuitable for detailed grading or drainage design.",
  },
  {
    slug: "north-facing-slope-solar-layout",
    category: "Engineering",
    title: "North-Facing Slope Constraints for Solar Layouts",
    description: "Understand why north-facing slopes above a project threshold may be excluded from preliminary northern-hemisphere layouts.",
    overview: "For northern-hemisphere projects, materially north-facing terrain can reduce solar access and complicate row geometry, tracker operation and grading. A screening rule can protect early capacity estimates from obviously adverse cells.",
    questions: ["Which downslope aspects are classified as north-facing?", "What slope threshold matches the preliminary technology?", "Are excluded areas contiguous or fragmented?", "Could detailed design recover some land safely?"],
    workflow: ["Calculate slope and downslope aspect from terrain samples.", "Apply the documented, user-selected slope and north-sector assumption.", "Dissolve qualifying cells into preliminary terrain-mask boundaries.", "Validate with higher-resolution terrain and technology-specific layout studies."],
    evidence: ["Elevation grid and calculation method", "Aspect convention and threshold", "Mapped exclusion boundary", "Tracker or fixed-tilt design criteria"],
    outputs: ["North-slope affected-area percentage", "Continuous preliminary exclusion boundary", "Validation actions for layout design"],
    caution: "The rule is a screening assumption, not a universal design limit. Hemisphere, system type, grading strategy and detailed topography can change the conclusion.",
  },
  {
    slug: "solar-drainage-screening",
    category: "Engineering",
    title: "Solar Site Drainage Screening",
    description: "Identify watercourses, low points, runoff pathways and drainage-study requirements before layout development.",
    overview: "Solar development changes surface roughness, access and concentrated flow paths even when panels are pile-mounted. Early drainage screening helps protect equipment, roads, receiving waters and downstream land.",
    questions: ["Which water features intersect or border the site?", "Where does runoff enter and leave the boundary?", "Could roads or compounds block natural flow?", "What baseline and design storms are required?"],
    workflow: ["Map surface water, wetlands and terrain-derived flow context.", "Inspect low points, crossings and downstream receptors.", "Reserve preliminary drainage corridors and setbacks.", "Commission hydrology, infiltration and erosion studies for design."],
    evidence: ["Watercourse and wetland mapping", "Topography and catchment boundaries", "Soil and infiltration data", "Local drainage standards and rainfall inputs"],
    outputs: ["Drainage constraints plan", "Crossing and setback schedule", "Hydrology and drainage design brief"],
    caution: "Desktop contours and water mapping may omit field drains, culverts and ephemeral channels. Field verification is essential.",
  },
  {
    slug: "solar-project-risk-register",
    category: "Development",
    title: "Solar Project Risk Register",
    description: "Create an accountable early-stage risk register linking causes, consequences, evidence, actions, owners and decision triggers.",
    overview: "A useful risk register is not a list of vague concerns. Each entry should explain the uncertain event, why it may occur, what it would affect, how exposure is rated and who owns the next action.",
    questions: ["What event or condition creates the risk?", "Which cost, schedule, performance or consent outcome is exposed?", "What evidence supports the rating?", "Who owns treatment and by when?"],
    workflow: ["Derive risks from screening findings and information gaps.", "Write cause-event-consequence statements.", "Rate inherent exposure using a defined matrix.", "Assign treatments, owners, due dates, triggers and residual ratings."],
    evidence: ["Constraint and due-diligence findings", "Programme and cost assumptions", "Stakeholder and authority correspondence", "Decision-gate criteria"],
    outputs: ["Controlled risk register", "Priority-action dashboard", "Decision-trigger and escalation log"],
    caution: "Risk scoring is only as reliable as the evidence and governance behind it. Ratings must be reviewed by accountable project disciplines.",
  },
  {
    slug: "solar-project-development-roadmap",
    category: "Development",
    title: "Solar Project Development Roadmap",
    description: "Coordinate solar development workstreams, dependencies, decision gates and evidence toward a defined readiness target.",
    overview: "A development roadmap connects land, grid, permitting, engineering, procurement and commercial work rather than showing isolated task lists. The critical path usually moves as new evidence arrives.",
    questions: ["What does the project mean by ready-to-build?", "Which workstreams and approvals are interdependent?", "What evidence closes each decision gate?", "Which long-lead activities control the programme?"],
    workflow: ["Define the target maturity state and decision gates.", "Map workstreams, owners, deliverables and dependencies.", "Identify critical-path and seasonal activities.", "Review progress against evidence, not percentage-complete claims."],
    evidence: ["Development scope and governance", "Permit and grid milestones", "Land and survey programme", "Design, procurement and finance requirements"],
    outputs: ["Integrated development roadmap", "Decision-gate evidence matrix", "Critical-path action list"],
    caution: "Generic milestone templates must be adapted to jurisdiction, connection process, procurement strategy and project governance.",
  },
  {
    slug: "solar-technical-due-diligence",
    category: "Due diligence",
    title: "Solar Project Technical Due Diligence",
    description: "Review project maturity, evidence quality, technical risks and information gaps in a decision-ready due-diligence structure.",
    overview: "Technical due diligence tests whether project claims are supported by current, internally consistent evidence. It should distinguish verified facts, reasonable assumptions, unresolved gaps and professional opinions.",
    questions: ["Which documents support the stated maturity?", "Are boundary, capacity, yield and grid assumptions consistent?", "Which risks could change value or schedule?", "What conditions should be attached to the decision?"],
    workflow: ["Set scope, materiality and reliance boundaries.", "Build a controlled document and evidence register.", "Test key claims across land, grid, consent, design, yield and cost.", "Report findings by severity with actions and decision implications."],
    evidence: ["Current document register", "Permits, land and grid agreements", "Design, studies and energy model", "Cost, programme and risk records"],
    outputs: ["Due-diligence findings register", "Information-gap schedule", "Executive technical-risk opinion"],
    caution: "Desktop review cannot validate missing or inaccessible evidence. Scope limitations and reliance conditions must remain explicit.",
  },
  {
    slug: "solar-site-visit-checklist",
    category: "Due diligence",
    title: "Solar Site Visit Checklist",
    description: "Plan a solar site visit around decisions, evidence capture, safety, access, terrain, drainage and stakeholder observations.",
    overview: "A site visit should test specific desktop assumptions rather than produce an unstructured photo archive. Every observation needs a location, context and link to a decision or follow-up action.",
    questions: ["Which desktop assumptions require field verification?", "What access and safety controls apply?", "Which observations need coordinates or measurements?", "How will evidence be indexed after the visit?"],
    workflow: ["Prepare a map-based inspection plan and HSE arrangements.", "Define observation points for access, terrain, drainage, receptors and infrastructure.", "Capture georeferenced photographs and field notes consistently.", "Issue a findings log with owners and required specialist follow-up."],
    evidence: ["Pre-visit constraints map", "Access permissions and HSE plan", "Georeferenced photographs and notes", "Interview and stakeholder records"],
    outputs: ["Completed site-visit record", "Photo and observation register", "Post-visit action plan"],
    caution: "A general reconnaissance is not a substitute for topographic, ecological, geotechnical, drainage or other specialist surveys.",
  },
  {
    slug: "solar-land-control-due-diligence",
    category: "Due diligence",
    title: "Solar Land Control Due Diligence",
    description: "Review whether land rights, boundaries, access and third-party interests support the proposed solar development strategy.",
    overview: "Land control must cover more than the panel field. Access, cable routes, substations, drainage, construction compounds and mitigation land can each require separate rights and conditions.",
    questions: ["Does the controlled land match the technical boundary?", "Are access and grid-route rights included?", "Which easements, covenants or occupiers affect development?", "Do option milestones align with the programme?"],
    workflow: ["Reconcile title plans, GIS boundaries and project components.", "Map required rights beyond the generation site.", "Review term, milestones, conditions and termination exposure.", "Track gaps with legal, survey and commercial owners."],
    evidence: ["Title and cadastral plans", "Options, leases and easements", "Rights-of-way and third-party interests", "Project layout and route requirements"],
    outputs: ["Land-rights matrix", "Boundary and rights gap plan", "Legal and commercial action schedule"],
    caution: "GIS boundaries are not legal-title evidence. Qualified local counsel and surveyors must verify ownership and enforceability.",
  },
  {
    slug: "solar-permitting-screening",
    category: "Development",
    title: "Solar Permitting and Planning Screening",
    description: "Identify likely consent pathways, policy constraints, studies, stakeholders and programme risks for a solar project.",
    overview: "Planning screening links jurisdiction-specific consent requirements to the actual project description, associated infrastructure and evidence programme. It should identify both formal approvals and informal stakeholder dependencies.",
    questions: ["Which authority and consent route apply?", "What policy designations or thresholds are relevant?", "Which studies and consultations are mandatory?", "What could delay validation or determination?"],
    workflow: ["Define the complete project and jurisdiction.", "Review policy, zoning, thresholds and authority guidance.", "Map required studies, consultations and submission evidence.", "Build a permitting programme with dependencies and decision gates."],
    evidence: ["Current planning policy and legislation", "Authority guidance and precedents", "Environmental and technical study scopes", "Stakeholder and consultation strategy"],
    outputs: ["Consent-pathway memo", "Application evidence matrix", "Permitting programme and risk register"],
    caution: "Consent requirements change and depend on project specifics. Confirm the route with competent authorities and local professional advisers.",
  },
  {
    slug: "solar-capex-benchmarking",
    category: "Engineering",
    title: "Solar CAPEX Benchmarking",
    description: "Build a transparent early solar CAPEX benchmark with scope boundaries, quantities, market basis, contingency and sensitivities.",
    overview: "A benchmark is useful only when its scope and date are clear. Unit costs should be tied to preliminary quantities and adjusted for site-specific civil, grid, logistics and development conditions.",
    questions: ["What is included and excluded from CAPEX?", "Which capacity basis and quantities are used?", "What market date, currency and location factors apply?", "How are uncertainty and contingency represented?"],
    workflow: ["Define the estimate class, scope and base date.", "Develop preliminary quantities from the technical concept.", "Apply benchmark rates and site-specific adjustments.", "Add risk-based contingency and test key sensitivities."],
    evidence: ["Scope and battery limits", "Preliminary quantities and design basis", "Comparable market benchmarks", "Risk register and escalation assumptions"],
    outputs: ["CAPEX breakdown", "Basis-of-estimate document", "Sensitivity and contingency summary"],
    caution: "Headline cost-per-MW values hide scope differences. Do not compare benchmarks without normalizing capacity, grid, development, taxes and owner costs.",
  },
  {
    slug: "bess-site-selection",
    category: "BESS",
    title: "BESS Site Selection",
    description: "Screen battery-storage sites for grid access, safety separation, planning, access, drainage and operational constraints.",
    overview: "BESS site selection is driven by grid function and safety as much as land area. Fire strategy, emergency access, noise, drainage, augmentation and hazardous interfaces need space from the beginning.",
    questions: ["What grid service and connection define the location?", "Are safety distances and emergency access achievable?", "Which receptors, flood or drainage issues matter?", "Is there space for augmentation and replacement logistics?"],
    workflow: ["Define power, energy duration, technology and connection concept.", "Screen candidate boundaries for grid, access, receptors and hazards.", "Reserve preliminary safety, drainage and operational zones.", "Compare sites using consistent technical and permitting evidence."],
    evidence: ["Grid connection requirements", "Battery technology and safety basis", "Fire, noise, flood and drainage context", "Access, logistics and land rights"],
    outputs: ["BESS candidate scorecard", "Preliminary site-blocking diagram", "Safety and permitting action plan"],
    caution: "Generic container density is not a safe layout basis. Supplier data, fire engineering, local codes and emergency-service consultation are required.",
  },
  {
    slug: "hybrid-solar-bess-feasibility",
    category: "BESS",
    title: "Hybrid Solar and BESS Feasibility",
    description: "Structure early feasibility for co-located solar and storage across land, grid, operating strategy, controls and commercial interfaces.",
    overview: "Hybrid feasibility is not the sum of separate solar and battery studies. The value and design depend on shared connection constraints, charging rules, controls, clipping capture, export limits and operating strategy.",
    questions: ["What operating objective does storage serve?", "How is the shared grid limit applied?", "Can the site accommodate both technologies safely?", "Which control and metering interfaces are required?"],
    workflow: ["Define use cases, power, duration and connection constraints.", "Develop solar and BESS land envelopes with shared infrastructure.", "Model representative dispatch and energy flows.", "Test technical, consent, revenue and delivery sensitivities."],
    evidence: ["Solar resource and generation profile", "BESS performance and degradation assumptions", "Grid import/export requirements", "Land, safety, planning and commercial constraints"],
    outputs: ["Hybrid configuration options", "Indicative dispatch and energy balance", "Integrated risk and development plan"],
    caution: "Simplified dispatch cannot establish revenue or warranty outcomes. Market modelling, controls design and supplier guarantees require specialist work.",
  },
  {
    slug: "solar-screening-report",
    category: "Due diligence",
    title: "Solar Site Screening Report",
    description: "Compile boundary, constraints, score, source evidence, yield and next actions into a traceable preliminary screening report.",
    overview: "A screening report should preserve the evidence behind the conclusion. Maps, scores and recommendations need source dates, limitations and a clear separation between measured facts, model outputs and professional judgement.",
    questions: ["Is the analyzed boundary uniquely identified?", "Can every finding be traced to a source and date?", "Are missing inputs visible?", "Do recommendations follow directly from the evidence?"],
    workflow: ["Freeze the candidate boundary and analysis timestamp.", "Record each criterion, source, status and finding.", "Include map, area, perimeter and indicative yield context.", "State limitations and prioritized verification actions."],
    evidence: ["Immutable analysis snapshot", "Constraint and source registers", "Dated boundary exhibit", "Calculation assumptions and audit identifiers"],
    outputs: ["Professional preliminary PDF", "CSV constraint register", "Decision-ready next-action list"],
    caution: "A screening report is not a planning opinion, legal report, grid study, survey, detailed design or investment recommendation.",
  },
  {
    slug: "solar-project-information-request-list",
    category: "Due diligence",
    title: "Solar Project Information Request List",
    description: "Build a focused information request list that connects missing documents to technical decisions and material risks.",
    overview: "An effective request list explains why each item is needed, the required version and the decision it supports. This prevents large undifferentiated document requests that obscure the material gaps.",
    questions: ["Which decision cannot be supported with current evidence?", "What exact document, dataset or confirmation is required?", "Who controls it and when can it be supplied?", "What is the consequence if it remains unavailable?"],
    workflow: ["Map required evidence to the review scope.", "Reconcile requests against the current data room.", "Prioritize items by materiality and decision timing.", "Track responses, superseded versions and residual gaps."],
    evidence: ["Scope and decision criteria", "Current document register", "Discipline review findings", "Owner, due date and response status"],
    outputs: ["Prioritized information request list", "Document version-control log", "Residual information-gap register"],
    caution: "Receipt of a document does not close a request unless its currency, completeness and relevance have been checked.",
  },
  {
    slug: "solar-project-decision-gates",
    category: "Development",
    title: "Solar Project Decision Gates",
    description: "Define evidence-based gates for progressing, holding, redesigning or stopping a solar development opportunity.",
    overview: "Decision gates protect capital by defining what must be true before the next expenditure. They work best when criteria are measurable, accountable and linked to current evidence rather than optimistic progress narratives.",
    questions: ["What decision is being made at this gate?", "Which minimum evidence is mandatory?", "Which risks can be accepted conditionally?", "Who has authority to approve exceptions?"],
    workflow: ["Define the gate purpose and possible outcomes.", "Set discipline-specific evidence and acceptance criteria.", "Prepare an exceptions and conditions register.", "Record the decision, rationale, owner and next review trigger."],
    evidence: ["Development strategy and governance", "Current technical and commercial evidence", "Risk and information-gap registers", "Approval authority and conditions"],
    outputs: ["Gate criteria matrix", "Decision paper", "Conditions and follow-up register"],
    caution: "A gate should not be passed solely because planned tasks are complete; the required evidence and residual risk must support the decision.",
  },
  {
    slug: "solar-project-data-room-structure",
    category: "Due diligence",
    title: "Solar Project Data Room Structure",
    description: "Organize solar project evidence for development control, technical review, transactions and auditability.",
    overview: "A controlled data room makes project maturity visible. Folder names alone are insufficient: documents need identifiers, versions, dates, status, owners and relationships to requirements or decisions.",
    questions: ["Which evidence categories match the project workstreams?", "How are current and superseded versions distinguished?", "Which documents are draft, approved or executed?", "Can reviewers identify missing evidence quickly?"],
    workflow: ["Define a workstream-based folder and naming convention.", "Create a master document register with status and ownership.", "Separate working, issued and executed evidence.", "Run periodic completeness and permissions reviews."],
    evidence: ["Project work breakdown structure", "Document numbering and status rules", "Master document register", "Access and confidentiality requirements"],
    outputs: ["Controlled data-room index", "Document-status dashboard", "Completeness and gap report"],
    caution: "A well-populated folder is not proof of maturity. Evidence must be reviewed for quality, currency, approval and consistency.",
  },
];

const pvgisSource = {
  name: "European Commission JRC — PVGIS",
  url: "https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis_en",
  use: "Solar-resource and indicative PV performance context",
};

const inspireSource = {
  name: "European Commission — INSPIRE Geoportal",
  url: "https://inspire-geoportal.ec.europa.eu/",
  use: "Discovery of official European spatial datasets and metadata",
};

const eiaSource = {
  name: "European Commission — Environmental Impact Assessment",
  url: "https://environment.ec.europa.eu/topics/environmental-assessments/environmental-impact-assessment_en",
  use: "EU environmental-assessment framework and Member State implementation context",
};

const floodsSource = {
  name: "European Commission — Floods Directive",
  url: "https://environment.ec.europa.eu/topics/water/floods_en",
  use: "Strategic flood-risk reporting framework and competent-authority context",
};

const terrainSource = {
  name: "AWS Open Data — Terrain Tiles",
  url: "https://registry.opendata.aws/terrain-tiles/",
  use: "Source registry for the regional DEM mosaic used in preliminary terrain screening",
};

const entsoeSource = {
  name: "ENTSO-E — Ten-Year Network Development Plan",
  url: "https://tyndp.entsoe.eu/",
  use: "European transmission-development context; not project-specific connection capacity",
};

const commonMarketContext = [
  "Portugal, Spain, Italy and Germany apply different national, regional and municipal planning controls; EU-wide layers are an initial evidence layer only.",
  "Grid feasibility must be checked through the relevant transmission or distribution system operator, including queue, capacity, studies and connection route.",
  "Cadastral boundaries, land rights, local setbacks and permit status require current national or competent-authority evidence.",
];

export const workflowGuideEnhancements: Record<
  string,
  WorkflowGuideEnhancement
> = {
  "utility-scale-solar-site-selection": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional two-site comparison",
      basis:
        "Site A has stronger irradiation but fragmented land and an unverified grid route. Site B has lower resource, a coherent boundary and clearer access evidence.",
      result:
        "Advance both only far enough to test the controlling uncertainty: grid and land continuity for Site A, grid capacity for Site B. Do not select on irradiation alone.",
      caveat:
        "The example demonstrates decision logic and does not represent a real project or market recommendation.",
    },
    sources: [inspireSource, eiaSource, entsoeSource, pvgisSource],
  },
  "solar-site-feasibility-study": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional feasibility gate",
      basis:
        "A 60 ha gross boundary has incomplete terrain and flood evidence and no operator-confirmed connection capacity.",
      result:
        "Issue a conditional hold: complete the development-envelope assumptions, authority flood review and grid evidence before fixing capacity or CAPEX.",
      caveat:
        "A feasibility gate records evidence sufficiency; it is not consent or investment approval.",
    },
    sources: [eiaSource, inspireSource, pvgisSource, entsoeSource],
  },
  "solar-gis-constraint-screening": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional mapped overlap",
      basis:
        "An EU reporting layer intersects 8% of a candidate boundary while a national source has not yet been obtained.",
      result:
        "Record the overlap as a screening trigger, preserve its identifier and request the current national dataset before assigning a legal buffer or usable-area deduction.",
      caveat:
        "Intersection does not by itself establish legal effect, severity or development prohibition.",
    },
    sources: [inspireSource, eiaSource, floodsSource, terrainSource],
  },
  "solar-land-area-estimation": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional gross-to-usable bridge",
      basis:
        "Start with 50 ha gross, deduct a 4 ha selected terrain mask, then apply a documented 15% allowance to the remaining land.",
      result:
        "The indicative usable-area assumption is 39.1 ha. At 0.65 MWp/ha it supports an illustrative 25.4 MWp before layout validation.",
      caveat:
        "Do not add overlapping deductions twice; calculate actual geometry and test contiguity before relying on the result.",
    },
    sources: [inspireSource, terrainSource, pvgisSource],
  },
  "solar-energy-yield-screening": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional specific-yield bridge",
      basis:
        "An illustrative 25 MWp DC envelope is multiplied by 1,600 kWh/kWp/year from a centroid screening result.",
      result:
        "The arithmetic result is 40 GWh/year before project-specific geometry, clipping, availability, curtailment, degradation and uncertainty are modelled.",
      caveat:
        "This is not P50 or P90 and must not be used as a bankable production forecast.",
    },
    sources: [pvgisSource],
  },
  "solar-grid-connection-screening": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional nearby substation",
      basis:
        "A mapped substation is 3 km from the site, but voltage, spare capacity, ownership and a viable cable corridor are unconfirmed.",
      result:
        "Treat proximity as a candidate connection option and open four evidence actions; do not score it as confirmed grid feasibility.",
      caveat:
        "Only the network operator and formal connection process can establish a viable point of connection.",
    },
    sources: [entsoeSource, inspireSource],
  },
  "solar-flood-risk-screening": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional reporting-area intersection",
      basis:
        "The candidate boundary intersects a Floods Directive reporting area but no current national depth or probability layer has been reviewed.",
      result:
        "Flag authority review and hydrology as mandatory next actions; do not treat the reporting polygon as an inundation footprint or automatic exclusion.",
      caveat:
        "Pluvial flooding, drainage, groundwater, climate allowances and safe access remain outside the strategic layer.",
    },
    sources: [floodsSource, inspireSource],
  },
  "solar-terrain-slope-assessment": {
    reviewedAt: "2026-08-11",
    reviewStatus:
      "SolarDev AI internal methodology review; independent technical review not yet published.",
    marketContext: commonMarketContext,
    workedExample: {
      title: "Fictional north-facing terrain assumption",
      basis:
        "A 30 m screening DEM identifies 6 ha above a user-selected 5° north-facing threshold within a 50 ha site.",
      result:
        "Carry 6 ha as a preliminary terrain mask and test 4°, 7° and technology-specific alternatives before fixing the usable area.",
      caveat:
        "The threshold is an assumption, not a universal non-usable rule; confirm it with survey-grade terrain and layout criteria.",
    },
    sources: [terrainSource, inspireSource],
  },
};

export function getWorkflowGuide(slug: string) {
  return workflowGuides.find((guide) => guide.slug === slug) ?? null;
}
