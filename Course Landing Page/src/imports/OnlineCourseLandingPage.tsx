function Heading() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[382px]" data-name="Heading 2">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#101828] text-[16px] text-nowrap top-[-2px] whitespace-pre">Let AI personalize your journey?</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-0 top-[36px] w-[382px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">Optional but recommended</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[40px] left-0 top-[68px] w-[382px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#6a7282] text-[14px] top-[-2px] w-[342px]">Vatra will ask you a few questions to create lessons that match your experience and goals</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[274.89px] size-[16px] top-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-gradient-to-r from-[#00bba7] h-[56px] relative rounded-[8px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] shrink-0 to-[#00b8db] w-full" data-name="Button">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[91.11px] text-[14px] text-nowrap text-white top-[16px] whitespace-pre">Yes, personalize with Vatra</p>
      <Icon />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[56px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[12.5px] text-[#364153] text-[16px] text-nowrap top-[16px] whitespace-pre">Skip for now</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[124px] items-start left-0 top-[140px] w-[382px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[264px] relative shrink-0 w-[382px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[264px] relative w-[382px]">
        <Heading />
        <Paragraph />
        <Paragraph1 />
        <Container />
      </div>
    </div>
  );
}

function OnboardingFlow() {
  return (
    <div className="h-[932px] relative rounded-[40px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] shrink-0 w-[430px]" data-name="OnboardingFlow" style={{ backgroundImage: "linear-gradient(114.767deg, rgb(240, 253, 250) 0%, rgb(255, 255, 255) 50%, rgb(250, 245, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[932px] items-center justify-center overflow-clip relative rounded-[inherit] w-[430px]">
        <Container1 />
      </div>
    </div>
  );
}

export default function OnlineCourseLandingPage() {
  return (
    <div className="content-stretch flex items-center justify-center relative size-full" data-name="Online Course Landing Page" style={{ backgroundImage: "linear-gradient(rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <OnboardingFlow />
    </div>
  );
}