export default function SidebarProfileComponent({src}:{src:string | null | undefined}) { 
    return (
        //ToDo: handle the case where the image isn't available you bitch
      <div className="relative px-2 pb-2 pt-1.5 rounded-full">
        {/* profile image */}
        <div
          className={`rounded-full w-8 h-8
            transition-all duration-300
            flex justify-center items-center border dark:border-white border-black bg-background`}
          style={{
            backgroundImage: `url("${src}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    );
}